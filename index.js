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
const STORAGE_KEY = "memoryResults";
let firstCard = null;
let secondCard = null;
let lockOnclick = false;
let totalPairs = 0;
let totalMoves = 0;
let timer;

const body = document.querySelector("body");

const header = document.createElement("header");
const newGameBtn = document.createElement("button");
const bestsBtn = document.createElement("button");
const main = document.createElement("main");
const cardsContainer = document.createElement("div");
const gameInfo = document.createElement("div");
const gamePairsString = document.createElement("p");
const gameMovesString = document.createElement("p");
const gameMoves = document.createElement("span");
const gamePairs = document.createElement("span");
const modal = document.createElement("dialog");
newGameBtn.addEventListener("click", () => initGame());
bestsBtn.addEventListener("click", () => openModal("bests"));

header.classList.add("header");
newGameBtn.classList.add("game__btn");
bestsBtn.classList.add("game__btn");
main.classList.add("main");
cardsContainer.classList.add("cardsContainer");
gameInfo.classList.add("game__info");

newGameBtn.textContent = "New Game";
bestsBtn.textContent = "Best results";
gamePairsString.textContent = "/8 pairs";
gameMovesString.textContent = "Moves: ";
gameMoves.textContent = "0";
gamePairs.textContent = "0";

header.append(newGameBtn, bestsBtn);
body.append(header, main, modal);
main.append(cardsContainer, gameInfo);
gameInfo.append(gameMovesString, gamePairsString);
gameMovesString.append(gameMoves);
gamePairsString.prepend(gamePairs);

modal.addEventListener("click", (e) => {
  const rect = modal.getBoundingClientRect();
  const clickedInside =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;

  if (!clickedInside) modal.close();
});

function shuffle(array) {
  array.sort(function () {
    return Math.random() - 0.5;
  });
}

function onClickCard(card, span) {
  if (
    lockOnclick ||
    card === firstCard?.[0] ||
    card.classList.contains("card--active") ||
    card === secondCard?.[0]
  )
    return;
  span.classList.toggle("card__img--hiden");

  if (!firstCard) {
    firstCard = [card, span];
    return;
  }
  secondCard = [card, span];
  totalMoves++;

  if (firstCard?.[1].textContent === secondCard?.[1].textContent) {
    firstCard?.[0].classList.add("card--active");
    secondCard?.[0].classList.add("card--active");
    firstCard = null;
    secondCard = null;
    lockOnclick = false;
    totalPairs++;
    updateContent(gamePairs, totalPairs);
    if (totalPairs === 8) {
      saveResult();
      openModal("winner");
    }
  } else {
    lockOnclick = true;
    timer = setTimeout(() => {
      firstCard?.[1].classList.add("card__img--hiden");
      secondCard?.[1].classList.add("card__img--hiden");
      firstCard = null;
      secondCard = null;
      lockOnclick = false;
    }, 900);
  }
  updateContent(gameMoves, totalMoves);
}

function initGame() {
  firstCard = null;
  secondCard = null;
  lockOnclick = false;
  totalPairs = 0;
  totalMoves = 0;
  clearTimeout(timer);
  updateContent(gameMoves, totalMoves);
  updateContent(gamePairs, totalPairs);

  shuffle(CARDS);
  cardsContainer.replaceChildren();
  CARDS.map((el) => {
    const card = document.createElement("div");
    const span = document.createElement("span");
    span.classList.add("card__img--hiden");
    span.textContent = el;
    card.append(span);
    card.classList.add("card");
    card.addEventListener("click", () => onClickCard(card, span));
    cardsContainer.append(card);
  });
}

function updateContent(node, value) {
  node.textContent = value;
}

function openModal(type) {
  modal.replaceChildren();

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.classList.add("game__btn");
  closeBtn.addEventListener("click", () => modal.close());

  if (type === "bests") {
    let results = getResults().slice(0, 10);
    if (results?.length) {
      const resultTable = document.createElement("table");
      results.map((raw, i) => {
        let trValues = document.createElement("tr");
        let num = document.createElement("th");
        let date = document.createElement("th");
        let moves = document.createElement("th");
        num.textContent = i + 1;
        date.textContent = raw.date;
        moves.textContent = `${raw.moves} moves`;
        trValues.append(num, date, moves);
        resultTable.append(trValues);
      });

      modal.append(resultTable);
    } else {
      const resultStr = document.createElement("p");
      resultStr.textContent = "No results";

      modal.append(resultStr);
    }
    modal.append(closeBtn);
  } else if (type === "winner") {
    const winStr = document.createElement("h1");
    const movesStr = document.createElement("p");
    const newGameMBtn = newGameBtn.cloneNode(true);

    newGameMBtn.addEventListener("click", () => {
      initGame();
      modal.close();
    });

    winStr.textContent = "You win!!!";
    movesStr.textContent = `Moves: ${totalMoves}`;

    modal.append(winStr, movesStr, newGameMBtn, closeBtn);
  }
  modal.showModal();
}

function saveResult() {
  let results = getResults();
  results.push({
    date: new Date().toLocaleDateString(),
    moves: totalMoves,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function getResults() {
  let results = localStorage.getItem(STORAGE_KEY);
  if (results) {
    return JSON.parse(results)
      .slice()
      .sort((a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        return new Date(a.date) - new Date(b.date);
      });
  } else {
    return [];
  }
}

initGame();
