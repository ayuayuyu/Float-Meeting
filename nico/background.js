let websocket;

chrome.runtime.onInstalled.addListener(() => {
  websocket = new WebSocket("wss://fastapi-websocket-ww61.onrender.com/ws/");

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
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "comment") {
    websocket.send(
      JSON.stringify({ type: "comment", comment: request.comment })
    );
    sendResponse({ status: "sent" });
  }
});

function showComment(comment) {
  const event = new CustomEvent("showComment", { detail: comment });
  window.dispatchEvent(event);
}
