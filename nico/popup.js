document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sendButton").addEventListener("click", () => {
    let comment = document.getElementById("commentInput").value;
    chrome.runtime.sendMessage(
      { type: "comment", comment },
      function (response) {
        console.log(response.status);
        updateStatus(response);
      }
    );
    // テキストフィールドをクリア
    document.getElementById("commentInput").value = "";
  });
  console.log("読み込まれた");
});

// ステータスを更新する関数
function updateStatus(res) {
  const statusElement = document.getElementById("status");
  console.log("fist");
  if (res.status === "sent") {
    console.log("connected");
    statusElement.textContent = "接続";
    statusElement.style.color = "green";
  } else if (res.message === "WebSocket is not connected") {
    console.log("disconnected");
    statusElement.textContent = "未接続";
    statusElement.style.color = "red";
  } else if (res.status === "error") {
    console.log("erro");
    statusElement.textContent = `Error: ${error}`;
    statusElement.style.color = "red";
  }
}
