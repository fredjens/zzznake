import { random, find, takeRight } from "lodash";
import config from "./config";
import {
  createDivElement,
  setDivColor,
  setDivsColor,
  drawLetter,
} from "./utils/div";
import keys from "./utils/keys";
import { S, N, A, K, E } from "./utils/letters";

const { dimensions, unit, snake, food, bgColor } = config;

let GAME_STARTED = false;
let GAME_RUNNING;
let SNAKE_DIRECTION;
let SNAKE_LOG = [];
let SNAKE_SPEED = 100;
let SCORE = 0;

/**
 * Draw the board with 3D wrapper
 */

createDivElement("board", {
  perspective: "800px",
  transformStyle: "preserve-3d",
});

createDivElement("board-inner", {
  height: `${unit * dimensions.height}px`,
  width: `${unit * dimensions.width}px`,
  position: "relative",
  fontSize: "0",
  transform: "rotateX(45deg) rotateZ(-5deg)",
  transformStyle: "preserve-3d",
  boxShadow: "0 60px 80px rgba(0,0,0,0.6), 0 0 120px rgba(80,60,200,0.15)",
  borderRadius: "4px",
}, "board");

/**
 * Draw the grid
 */

for (let i = 0; i < dimensions.height; i++) {
  for (let j = 0; j < dimensions.width; j++) {
    const el = createDivElement(
      `${i + 1}.${j + 1}`,
      {
        width: `${unit}px`,
        height: `${unit}px`,
        display: "inline-block",
        background: bgColor,
      },
      "board-inner"
    );
    if (el) el.classList.add("cell");
  }
}

/**
 * Draw the snake
 */

const showSnake = () =>
  setDivsColor(takeRight(SNAKE_LOG, snake.body), config.snakeColor, "cell-snake");

const hideSnake = () => setDivsColor(takeRight(SNAKE_LOG, snake.body), bgColor);

/**
 * Move the snake
 */

const pushToSnakeLog = (cords) => {
  SNAKE_LOG.push(cords);
};

const moveSnake = (direction) => {
  hideSnake();

  if (direction === "left") {
    snake.y--;
  }

  if (direction === "up") {
    snake.x--;
  }

  if (direction === "right") {
    snake.y++;
  }

  if (direction === "down") {
    snake.x++;
  }

  if (snake.y < 1) {
    snake.y = dimensions.height;
  }

  if (snake.x < 1) {
    snake.x = dimensions.width;
  }

  if (snake.x > dimensions.width) {
    snake.x = 1;
  }

  if (snake.y > dimensions.height) {
    snake.y = 1;
  }

  pushToSnakeLog({ x: snake.x, y: snake.y });

  showSnake();
};

/**
 * Set key events
 */

const setSnakeDirection = (direction) => (SNAKE_DIRECTION = direction);

const keyFunctions = ({ keyCode }) => {
  switch (keyCode) {
    case keys.ENTER:
      if (GAME_STARTED) return;
      startGame();
    case keys.LEFT:
      setSnakeDirection("left");
      break;
    case keys.UP:
      setSnakeDirection("up");
      break;
    case keys.RIGHT:
      setSnakeDirection("right");
      break;
    case keys.DOWN:
      setSnakeDirection("down");
      break;
  }
};

document.addEventListener("keydown", keyFunctions);

/**
 * Make food
 */

const makeFood = () => {
  const x = random(1, config.dimensions.width);
  const y = random(1, config.dimensions.height);

  const snakeLength = SNAKE_LOG.length - 1;
  const snakeBody = SNAKE_LOG.slice(snakeLength - snake.body, snakeLength);

  if (find(snakeBody, { x, y })) {
    console.log("food placed under the snake...");
    return makeFood();
  }

  food.x = x;
  food.y = y;

  setDivColor(config.foodColor, x, y, "cell-food");
};

/**
 * Check if snake is eating
 */

const updateScore = () => {
  const scoreEl = document.getElementById('score');
  if (!scoreEl) return;
  scoreEl.querySelector('.score-value').textContent = SCORE;
};

const checkIfSnakeIsEating = (snake, food) => {
  if (snake.x === food.x && snake.y === food.y) {
    snake.body = snake.body + 1;
    SNAKE_SPEED = SNAKE_SPEED - 10;
    SCORE++;
    updateScore();
    makeFood();
  }
};

/**
 * Check collision
 */

const checkCollision = ({ x, y }) => {
  const snakeLength = SNAKE_LOG.length - 2;
  const snakeBody = SNAKE_LOG.slice(snakeLength - snake.body, snakeLength);

  if (find(snakeBody, { x, y })) {
    GAME_STARTED = false;
    clearInterval(GAME_RUNNING);
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.style.display = 'none';
    resetBoard();
    startScreen();
  }
};

/**
 * Reset board to clear all cells
 */

const resetBoard = () => {
  for (let i = 0; i < dimensions.height; i++) {
    for (let j = 0; j < dimensions.width; j++) {
      setDivColor(bgColor, i + 1, j + 1);
    }
  }
};

/**
 * Start screen
 */

const startScreen = () => {
  S.forEach(drawLetter);
  N.forEach(drawLetter);
  A.forEach(drawLetter);
  K.forEach(drawLetter);
  E.forEach(drawLetter);
};

/**
 * Run game
 */

const startGame = () => {
  SNAKE_LOG = [];
  SNAKE_SPEED = 100;
  SCORE = 0;
  snake.x = 25;
  snake.y = 25;
  snake.body = 2;

  resetBoard();

  const scoreEl = document.getElementById('score');
  if (scoreEl) {
    scoreEl.style.display = 'block';
    scoreEl.querySelector('.score-value').textContent = '0';
  }

  const runGame = () => {
    moveSnake(SNAKE_DIRECTION);
    checkCollision(snake);
    checkIfSnakeIsEating(snake, food);
    GAME_RUNNING = setTimeout(runGame, SNAKE_SPEED);
  };

  GAME_STARTED = true;
  makeFood();
  runGame();
};

startScreen();
