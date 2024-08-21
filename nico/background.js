let websocket;

chrome.runtime.onInstalled.addListener(() => {
  websocket = new WebSocket("wss://fastapi-websocket-ww61.onrender.com/ws/");

  websocket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  websocket.onmessage = (event) => {
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

  websocket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  websocket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "comment") {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(
        JSON.stringify({ type: "comment", comment: request.comment })
      );
      sendResponse({ status: "sent" });
    } else {
      console.error("WebSocket is not connected");
      sendResponse({ status: "error", message: "WebSocket is not connected" });
    }
  }
});

function showComment(comment) {
  const event = new CustomEvent("showComment", { detail: comment });
  window.dispatchEvent(event);
}
