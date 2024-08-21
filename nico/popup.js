document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sendButton").addEventListener("click", () => {
    let comment = document.getElementById("commentInput").value;
    chrome.runtime.sendMessage({ type: "comment", comment });
    // テキストフィールドをクリア
    document.getElementById("commentInput").value = "";
  });
});
