function copyHexCode(card) {
  const code = card.querySelector(".color-code").textContent;
  navigator.clipboard.writeText("#" + code);
  card.classList.add("copied");
  setTimeout(() => card.classList.remove("copied"), 1000);
}
