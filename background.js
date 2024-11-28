const URL = process.env.API_URL;
const ws = new WebSocket(URL);

chrome.runtime.onInstalled.addListener(() => {
  ws.onopen = () => {
    console.log("WebSocket connection opened");
    sendMessageToPopup({ type: "status", status: "connected" });
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "comment") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: showComment,
            args: [data.comment],
          });
        }
      });
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    sendMessageToPopup({
      type: "status",
      status: "error",
      error: error.message,
    });
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
    sendMessageToPopup({ type: "status", status: "disconnected" });
  };
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "comment") {
    if (ws && ws.readyState === WebSocket.OPEN) {
      Promise.resolve()
        .then(() => {
          ws.send(
            JSON.stringify({ type: "comment", comment: request.comment })
          );
        })
        .then(() => {
          sendResponse({ status: "sent" });
        })
        .catch((error) => {
          console.error("Failed to send comment:", error);
          sendResponse({ status: "error", message: "Failed" });
        });
    } else {
      console.error("WebSocket is not connected");
      sendResponse({ status: "error", message: "WebSocket is not connected" });
    }
  }
  return true;
});

function showComment(comment) {
  const event = new CustomEvent("showComment", { detail: comment });
  window.dispatchEvent(event);
}

// ポップアップが開かれているか確認してからメッセージを送信する関数
function sendMessageToPopup(message) {
  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      console.warn("Popup is not open.");
    } else {
      console.log("Message sent to popup:", response);
    }
  });
}
