const CARDS = [
  "💖",
  "💥",
  "❓",
  "🌩",
  "⭐",
  "🌊",
  "❄",
  "⚡",
  "💖",
  "💥",
  "❓",
  "🌩",
  "⭐",
  "🌊",
  "❄",
  "⚡",
];

const body = document.querySelector("body");

const header = document.createElement("header");
const newGameBtn = document.createElement("button");
const bestsBtn = document.createElement("button");
const main = document.createElement("main");
const cardsContainer = document.createElement("div");

header.classList.add("header");
newGameBtn.classList.add("header__btn");
bestsBtn.classList.add("header__btn");
main.classList.add("main");
cardsContainer.classList.add("cardsContainer");

newGameBtn.textContent = "New Game";
bestsBtn.textContent = "Best results";

header.append(newGameBtn, bestsBtn);
body.append(header, main);
main.append(cardsContainer);

function shuffle(array) {
  array.sort(function () {
    return Math.random() - 0.5;
  });
}
shuffle(CARDS);

CARDS.map((el) => {
  const card = document.createElement("div");
  const span = document.createElement("span");
  span.textContent = el;
  card.append(span);
  card.classList.add("card");
  cardsContainer.append(card);
});
