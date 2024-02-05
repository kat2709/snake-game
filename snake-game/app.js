const foodArr = [
  "apple",
  "banana",
  "cherry",
  "berry",
  "mango",
  "orange",
  "strawberry",
  "snack",
  "sausage",
  "sandwich",
  "pudding",
  "pizza",
  "pasta",
  "noodle",
  "icecream",
  "icecream-two",
  "grape",
  "egg",
  "cheese",
  "cake",
  "ananas",
];

const gridContainer = document.querySelector(".grid-container");
const gameScore = document.querySelector("#game-score");
let timerId = undefined;
let snakeArr = [];
let foodPos = undefined;
const movesQueue = [];
let currentMove = undefined;
let score = 0;
let bestScoresArr = [];
const arrowUp = document.querySelector("#arrow-up");
const arrowLeft = document.querySelector("#arrow-left");
const arrowRight = document.querySelector("#arrow-right");
const arrowDown = document.querySelector("#arrow-down");
const settingBtn = document.querySelector("#setting");
const settingDialog = document.querySelector(".setting-dialog");
const closeBtn = document.querySelector("#close-btn");
const maxScoreSize = 10;

const sounds = [
  "assets/gameover.mp3",
  "assets/biting.mp3",
  "assets/newgame.mp3",
];

function main() {
  window.addEventListener("keydown", handleKeydown);
  createGrid();
  createSnake();
  createFood();
}
main();

function step() {
  const getNextMove = movesQueue.shift() || currentMove;
  const nextMove = getNextMove(snakeArr[0]);
  currentMove = getNextMove;

  if (snakeArr.find((s) => s === nextMove)) {
    // game over
    createSound(0);

    bestScoresArr.push(score);
    localStorage.setItem("scoreArr", JSON.stringify(bestScoresArr));

    gridContainer.innerHTML = "";
    drawScoreTable();
    clearInterval(timerId);
    timerId = undefined;
    window.removeEventListener("keydown", handleKeydown);
    movesQueue.length = 0;
    snakeArr.length = 0;
    foodPos = undefined;
    currentMove = undefined;
    return;
  }

  const tail = snakeArr[snakeArr.length - 1];
  const nextGridCell = document.getElementById(String(nextMove));
  nextGridCell.className = ""; // creal all styles
  nextGridCell.classList.add("grid-cell"); // draw head

  // move snake
  let prev = nextMove;
  for (let i = 0; i < snakeArr.length; i++) {
    const nextPrev = snakeArr[i];
    snakeArr[i] = prev;
    prev = nextPrev;
  }

  // eating food
  if (String(nextMove) === foodPos) {
    // grow snake
    createSound(1);

    snakeArr.push(tail);
    foodPos = undefined;
    score += 100;
    gameScore.innerHTML = score;
  } else {
    // delete tail
    const tailEl = document.getElementById(String(tail));
    tailEl.classList.remove("snake");
    tailEl.classList.remove(
      "snake-left",
      "snake-right",
      "snake-up",
      "snake-down",
      "snake-head"
    );
  }

  if (!foodPos) createFood();

  // clear prevHead snake
  if (snakeArr.length > 1) {
    const prevHead = document.getElementById(String(snakeArr[1]));
    prevHead.classList.remove(
      "snake-left",
      "snake-right",
      "snake-up",
      "snake-down",
      "snake-head"
    );
  }

  // change head rotation
  const snakeHead = document.getElementById(`${snakeArr[0]}`);
  snakeHead.classList.add("snake-head");
  if (getNextMove === goLeft) {
    snakeHead.classList.add("snake-left");
  } else if (getNextMove === goRight) {
    snakeHead.classList.add("snake-right");
  } else if (getNextMove === goUp) {
    snakeHead.classList.add("snake-up");
  } else if (getNextMove === goDown) {
    snakeHead.classList.add("snake-down");
  }

  for (let i = 1; i < snakeArr.length; i++) {
    const snakeTail = document.getElementById(String(snakeArr[i]));
    snakeTail.classList.add("snake");
  }
}

function createGrid() {
  for (let i = 0; i < 100; i++) {
    const gridCell = document.createElement("div");
    gridCell.setAttribute("id", i + 1);
    gridCell.classList.add("grid-cell");
    gridContainer.appendChild(gridCell);
  }
}

function createSnake() {
  const startGridCell = document.getElementById("45");
  startGridCell.classList.add("snake-head");
  snakeArr.push(startGridCell.id);
}

function createFood() {
  let randomNumCell = Math.ceil(Math.random() * 100);
  while (snakeArr.find((s) => String(s) === String(randomNumCell))) {
    randomNumCell = Math.ceil(Math.random() * 100);
  }
  const foodCell = document.getElementById(`${randomNumCell}`);
  foodCell.classList.add("food");
  foodPos = String(randomNumCell);

  let randomNumFood = Math.floor(Math.random() * foodArr.length);
  foodCell.classList.add(`${foodArr[randomNumFood]}`);
}

function goLeft(head) {
  if ((head - 1) % 10 === 0) {
    return Number(head) + 9;
  } else {
    return head - 1;
  }
}

function goRight(head) {
  if (head % 10 === 0) {
    return Number(head) - 9;
  } else {
    return Number(head) + 1;
  }
}

function goUp(head) {
  if (head <= 10) {
    return Number(head) + 90;
  } else {
    return Number(head) - 10;
  }
}

function goDown(head) {
  if (head >= 91) {
    return Number(head) - 90;
  } else {
    return Number(head) + 10;
  }
}

function handleKeydown(e) {
  switch (e.code) {
    case "ArrowRight":
    case "KeyD":
      if (
        currentMove === goLeft || // cannot go oposit direction
        movesQueue[movesQueue.length - 1] === goLeft || // cannot go oposit direction
        currentMove === goRight || // we already move that way
        movesQueue[movesQueue.length - 1] === goRight // we already move that way
      ) {
        break;
      }
      movesQueue.push(goRight);
      break;
    case "ArrowLeft":
    case "KeyA":
      if (
        currentMove === goRight ||
        movesQueue[movesQueue.length - 1] === goRight ||
        currentMove === goLeft ||
        movesQueue[movesQueue.length - 1] === goLeft
      ) {
        break;
      }
      movesQueue.push(goLeft);
      break;
    case "ArrowUp":
    case "KeyW":
      if (
        currentMove === goDown ||
        movesQueue[movesQueue.length - 1] === goDown ||
        currentMove === goUp ||
        movesQueue[movesQueue.length - 1] === goUp
      ) {
        break;
      }
      movesQueue.push(goUp);
      break;
    case "ArrowDown":
    case "KeyS":
      if (
        currentMove === goUp ||
        movesQueue[movesQueue.length - 1] === goUp ||
        currentMove === goDown ||
        movesQueue[movesQueue.length - 1] === goDown
      ) {
        break;
      }
      movesQueue.push(goDown);
      break;
    default:
      return;
  }
  if (!timerId) {
    currentMove = movesQueue.shift();
    timerId = setInterval(step, 250);
  }
}

function drawScoreTable() {
  const gameOverTitle = document.createElement("h2");
  gameOverTitle.innerHTML = "game over!";
  gridContainer.appendChild(gameOverTitle);

  const yourScore = document.createElement("p");
  yourScore.classList.add("your-score");
  yourScore.innerHTML = `Your score: ${score} pointes!`;
  gridContainer.appendChild(yourScore);

  const bestScoresTitle = document.createElement("h3");
  bestScoresTitle.innerHTML = "top scores:";
  gridContainer.appendChild(bestScoresTitle);

  bestScoresArr.sort((a, b) => b - a);
  if (bestScoresArr.length > maxScoreSize) {
    bestScoresArr.length = maxScoreSize;
  }
  localStorage.setItem("scoreArr", JSON.stringify(bestScoresArr));

  for (let i = 0; i < maxScoreSize; i++) {
    const score = document.createElement("p");
    score.classList.add("score-table");
    score.innerHTML = `${i + 1}. ${bestScoresArr[i] || 0}`;
    gridContainer.appendChild(score);
  }

  const newGameBtn = document.createElement("button");
  newGameBtn.classList.add("newgame-btn");
  newGameBtn.innerHTML = "new game";
  gridContainer.appendChild(newGameBtn);

  newGameBtn.addEventListener("click", () => {
    createSound(2);
    gridContainer.innerHTML = "";
    score = 0;
    gameScore.innerHTML = 0;
    main();
  });
}

arrowUp.addEventListener("click", () => {
  if (
    currentMove === goDown ||
    movesQueue[movesQueue.length - 1] === goDown ||
    currentMove === goUp ||
    movesQueue[movesQueue.length - 1] === goUp
  ) {
    return;
  }
  movesQueue.push(goUp);
  if (!timerId) {
    currentMove = movesQueue.shift();
    timerId = setInterval(step, 250);
  }
});

arrowLeft.addEventListener("click", () => {
  if (
    currentMove === goRight ||
    movesQueue[movesQueue.length - 1] === goRight ||
    currentMove === goLeft ||
    movesQueue[movesQueue.length - 1] === goLeft
  ) {
    return;
  }
  movesQueue.push(goLeft);
  if (!timerId) {
    currentMove = movesQueue.shift();
    timerId = setInterval(step, 250);
  }
});

arrowRight.addEventListener("click", () => {
  if (
    currentMove === goLeft || // cannot go oposit direction
    movesQueue[movesQueue.length - 1] === goLeft || // cannot go oposit direction
    currentMove === goRight || // we already move that way
    movesQueue[movesQueue.length - 1] === goRight // we already move that way
  ) {
    return;
  }
  movesQueue.push(goRight);
  if (!timerId) {
    currentMove = movesQueue.shift();
    timerId = setInterval(step, 250);
  }
});

arrowDown.addEventListener("click", () => {
  if (
    currentMove === goDown ||
    movesQueue[movesQueue.length - 1] === goDown ||
    currentMove === goUp ||
    movesQueue[movesQueue.length - 1] === goUp
  ) {
    return;
  }
  movesQueue.push(goDown);
  if (!timerId) {
    currentMove = movesQueue.shift();
    timerId = setInterval(step, 250);
  }
});

settingBtn.addEventListener("click", () => {
  settingDialog.showModal();
  document.documentElement.classList.add("blackout-style");
});

closeBtn.addEventListener("click", () => {
  settingDialog.close();
  document.documentElement.classList.remove("blackout-style");
});

settingDialog.addEventListener("click", (event) => {
  if (event.target === settingDialog) {
    settingDialog.close();
    document.documentElement.classList.remove("blackout-style");
  }
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    document.documentElement.classList.remove("blackout-style");
  }
});

window.onload = () => {
  const scoreArr = JSON.parse(localStorage.getItem("scoreArr"));
  if (scoreArr && scoreArr.length > 0) {
    bestScoresArr = scoreArr;
  }
};

function createSound(i) {
  const sound = document.createElement("audio");
  sound.src = sounds[i];
  audio.play();
}
