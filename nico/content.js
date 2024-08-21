window.addEventListener("showComment", (event) => {
  const comment = event.detail;
  displayComment(comment);
});

function displayComment(comment) {
  const commentElement = document.createElement("div");
  commentElement.textContent = comment;
  commentElement.style.position = "fixed";
  commentElement.style.top = `${Math.random() * window.innerHeight}px`;
  commentElement.style.right = "0px";
  commentElement.style.whiteSpace = "nowrap";
  commentElement.style.fontSize = "24px";
  commentElement.style.color = "#ffffff";
  commentElement.style.textShadow = "2px 2px 4px #000000";
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
