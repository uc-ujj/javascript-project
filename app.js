const grid = document.querySelector(".grid");
const level = document.getElementById("level");
const incLevelBtn = document.getElementById("level-inc");
const decLevelBtn = document.getElementById("level-dec");
const moveLeftBtn = document.getElementById("move-left");
const moveDownBtn = document.getElementById("move-down");
const moveRightBtn = document.getElementById("move-right");
const scoreDisplay = document.querySelector("#score");

for (let i = 0; i < 30; i++) {
  const div = document.createElement("div");
  div.classList.add("ball");
  // div.textContent = i;
  grid.prepend(div);
}

let squares = Array.from(document.querySelectorAll(".grid div"));

const width = 3;
let nextRandom = 0;

let score = 0;
const colors = ["yellow", "skyblue", "purple", "green"];

let currentPosition = -2;

//randomly select a Number for Color
let random = Math.floor(Math.random() * 4);
let current = [3];

//draw the Ball
function draw() {
  squares[currentPosition + 3].style.backgroundColor = colors[random];
}

//undraw the Ball
function undraw() {
  squares[currentPosition + 3].style.backgroundColor = "";
}

//assign functions to keys
function control(e) {
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}
document.addEventListener("keyup", control);

let time = 1000;
let timer;

let currLevel = 0;

// Increasing the Level
function increaseLevel() {
  currLevel += 1;
  level.textContent = currLevel;

  //   Increase Speed
  clearInterval(timer);
  time -= 200;
  timer = setInterval(moveDown, time);
}

function decreaseLevel() {
  if (currLevel > 0) {
    currLevel -= 1;
    level.textContent = currLevel;

    // Decreasing Speed
    clearInterval(timer);
    time += 200;
    timer = setInterval(moveDown, time);
  }
}

// Level Button Event Listeners
incLevelBtn.addEventListener("click", () => increaseLevel());
decLevelBtn.addEventListener("click", () => decreaseLevel());

// Control Button Event Listener
moveLeftBtn.addEventListener("click", () => moveLeft());
moveRightBtn.addEventListener("click", () => moveRight());
moveDownBtn.addEventListener("click", () => moveDown());

//move down function
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

//freeze function
function freeze() {
  if (squares[currentPosition + 3 + width].classList.contains("taken")) {
    squares[currentPosition + 3].classList.add("taken");

    //start a new ball falling
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * 4);

    currentPosition = -2;

    draw();
    addScore();
    gameOver();
  }
}

//move the ball left
function moveLeft() {
  undraw();
  const isAtLeftEdge = (currentPosition + 3) % width === 0;

  if (!isAtLeftEdge) currentPosition -= 1;
  if (squares[currentPosition + 3].classList.contains("taken")) {
    currentPosition += 1;
  }
  draw();
}

//move the ball right
function moveRight() {
  undraw();
  const isAtRightEdge = (currentPosition + 3) % width === width - 1;

  if (!isAtRightEdge) currentPosition += 1;
  if (squares[currentPosition + 3].classList.contains("taken")) {
    currentPosition -= 1;
  }
  draw();
}

///Checking Position of the Ball
function isAtRight() {
  return (currentPosition + 3 + 1) % width === 0;
}

function isAtLeft() {
  return (currentPosition + 3) % width === 0;
}

//add score
function addScore() {
  // Score for same Color Row
  for (let i = 0; i < 30; i += width) {
    const row = [i, i + 1, i + 2];
    if (row.every((index) => squares[index].classList.contains("taken"))) {
      if (
        squares[row[0]].style.backgroundColor &&
        squares[row[0]].style.backgroundColor ===
          squares[row[1]].style.backgroundColor &&
        squares[row[0]].style.backgroundColor ===
          squares[row[2]].style.backgroundColor
      )
        setTimeout(() => {
          score += 10;
          scoreDisplay.innerHTML = score;
          row.forEach((index) => {
            squares[index].classList.remove("taken");
            // squares[index].classList.remove("ball");
            squares[index].style.backgroundColor = "";
          });
          const squaresRemoved = squares.splice(i, width);
          squares = squaresRemoved.concat(squares);
          squares.forEach((cell) => grid.append(cell));
        }, 100);
    }
  }

  // Score for same Color Column
  let currCol;
  let prevCol;
  let nextCol;

  for (let i = 3; i < 6; i += 1) {
    // console.log("");
    // console.log(i);

    for (let j = i + 3; j < 27; j += 3) {
      // console.log(j);

      prevCol = squares[j - 3].style.backgroundColor;
      currCol = squares[j].style.backgroundColor;
      nextCol = squares[j + 3].style.backgroundColor;

      if (
        (prevCol || currCol || nextCol) &&
        prevCol === currCol &&
        currCol === nextCol
      ) {
        score += 10;
        scoreDisplay.innerHTML = score;
        setTimeout(() => {
          squares[j - 3].style.backgroundColor = "";
          squares[j].style.backgroundColor = "";
          squares[j + 3].style.backgroundColor = "";

          squares[j - 3].classList.remove("taken");
          squares[j].classList.remove("taken");
          squares[j + 3].classList.remove("taken");
        }, 100);
      }
    }
  }
}

//end game
function gameOver() {
  if (
    squares[3].classList.contains("taken") ||
    squares[4].classList.contains("taken") ||
    squares[5].classList.contains("taken")
  ) {
    scoreDisplay.innerHTML = "Game Over";
    clearInterval(timer);
    setTimeout(() => {
      // Show the modal
      const gameOverModal = document.getElementById("gameOverModal");
      const finalScore = document.getElementById("finalScore");
      gameOverModal.style.display = "block";
      finalScore.textContent = `You scored: ${score}`;
    }, 200);
  }
}

// Get the modal close button and add an event listener to it
const closeModalBtn = document.getElementById("closeModalBtn");
closeModalBtn.addEventListener("click", () => {
  const gameOverModal = document.getElementById("gameOverModal");
  gameOverModal.style.display = "none";
});

draw();
timer = setInterval(moveDown, time);
nextRandom = Math.floor(Math.random() * 4);
