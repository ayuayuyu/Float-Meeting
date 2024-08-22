window.addEventListener("showComment", (event) => {
  const comment = event.detail;
  displayComment(comment);
});

function displayComment(comment) {
  const commentElement = document.createElement("div");
  const min = window.innerHeight * 0.2; // 上部20%
  const max = window.innerHeight * 0.8; // 下部80%
  commentElement.textContent = comment;
  commentElement.style.position = "fixed";
  commentElement.style.zIndex = "1000";
  commentElement.style.top = `${Math.random() * (max - min) + min}px`;
  commentElement.style.right = "0px";
  commentElement.style.whiteSpace = "nowrap";
  commentElement.style.fontSize = "24px";
  commentElement.style.color = "#ffffff";
  commentElement.style.textShadow = "3px 3px 4px #000000";
  document.body.appendChild(commentElement);

  const move = () => {
    const currentRight = parseInt(commentElement.style.right, 10);
    if (currentRight > window.innerWidth) {
      commentElement.remove();
    } else {
      commentElement.style.right = `${currentRight + 2}px`;
      requestAnimationFrame(move);
    }
  };
  move();
}
