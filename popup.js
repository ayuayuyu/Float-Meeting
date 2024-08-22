const send = document.getElementById("sendButton");
const form = document.getElementById("form");

send.addEventListener("click", () => {
  sendComment();
});

//Enter、returnで送信
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

//コメントを送る関数
function sendComment() {
  const comment = document.getElementById("commentInput").value;
  chrome.runtime.sendMessage({ type: "comment", comment }, function (response) {
    console.log(response.status);
    console.log(comment);
    //状態を送る
    updateStatus(response);
  });
  // テキストフィールドをクリア
  document.getElementById("commentInput").value = "";
}
// ステータスを更新する関数
function updateStatus(res) {
  const statusElement = document.getElementById("status");
  if (res.status === "sent") {
    statusElement.textContent = "接続中";
    statusElement.style.color = "green";
  } else if (res.message === "WebSocket is not connected") {
    statusElement.textContent = "未接続";
    statusElement.style.color = "red";
  } else if (res.status === "error") {
    statusElement.textContent = "Error";
    statusElement.style.color = "red";
  }
}
