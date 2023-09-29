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

// squares[0].style.borderBottom = "1px solid black";
// squares[0].style.borderRadius = "0px";
// squares[1].style.borderRadius = "0px";
// squares[1].style.borderBottom = "1px solid black";
// squares[2].style.borderBottom = "1px solid black";
// squares[2].style.borderRadius = "0px";

const width = 3;
let nextRandom = 0;

let score = 0;
const colors = ["yellow", "skyblue", "purple", "green"];

let currentPosition = 1;

//randomly select a Number for Color
let random = Math.floor(Math.random() * 4);
let current = [3];

//draw the Ball
function draw() {
  // squares[currentPosition + 3].classList.add("ball");
  // if (currentPosition < 3)
  //   squares[currentPosition].style.backgroundColor = colors[random];
  squares[currentPosition + 3].style.backgroundColor = colors[random];
}

//undraw the Ball
function undraw() {
  // if (currentPosition < 3) squares[currentPosition].style.backgroundColor = "";
  // squares[currentPosition + 3].classList.remove("ball");
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

// Increasing the Level
function increaseLevel() {
  let currLevel = Number(level.textContent);
  currLevel += 1;
  level.textContent = currLevel;
  //   console.log(level.textContent);

  //   Increase Speed
  clearInterval(timer);
  time -= 200;
  timer = setInterval(moveDown, time);
  22;
}

function decreaseLevel() {
  let currLevel = Number(level.textContent);
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
  // console.log(currentPosition);
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

    currentPosition = 1;

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
      ) {
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
      }
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
        (prevCol === currCol) & (prevCol === nextCol)
      ) {
        score += 10;
        squares[j - 3].style.backgroundColor = "";
        squares[j].style.backgroundColor = "";
        squares[j + 3].style.backgroundColor = "";

        squares[j - 3].classList.remove("taken");
        squares[j].classList.remove("taken");
        squares[j + 3].classList.remove("taken");
      }
    }
  }
}

//end game
function gameOver() {
  if (
    squares[6].classList.contains("taken") ||
    squares[7].classList.contains("taken") ||
    squares[8].classList.contains("taken")
  ) {
    // if (row.every((index) => squares[index].classList.contains("taken"))) {
    //   // const row = [180, 181, 182, 183, 184, 185, 186, 187, 188, 189];
    // }
    scoreDisplay.innerHTML = "Game Over";
    clearInterval(timer);
    setTimeout(() => {
      alert(`You scored: ${score}`);
    }, 200);
  }
}

draw();
timer = setInterval(moveDown, time);
nextRandom = Math.floor(Math.random() * 4);

// Add textContent on squares for reference
// for (let i = 0; i < squares.length; i++) {
//   squares[i].textContent = i;
// }
