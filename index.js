const CARDS = [];

const body = document.querySelector("body");

const header = document.createElement("header");
const newGameBtn = document.createElement("button");
const bestsBtn = document.createElement("button");

header.classList.add("header");
newGameBtn.classList.add("header__btn");
bestsBtn.classList.add("header__btn");

newGameBtn.textContent = "New Game";
bestsBtn.textContent = "Best results";

header.append(newGameBtn, bestsBtn);
body.append(header);
