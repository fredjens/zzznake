import { random, find, takeRight } from "lodash";
import config from "./config";
import {
  createDivElement,
  setDivColor,
  setDivsColor,
  drawLetter,
  clearBoard,
} from "./utils/div";
import keys from "./utils/keys";
import { S, N, A, K, E } from "./utils/letters";

const { dimensions, unit, snake, food, bgColor } = config;

const INITIAL_SPEED = 120;
const MIN_SPEED = 40;

let GAME_STARTED = false;
let GAME_RUNNING;
let SNAKE_DIRECTION;
let SNAKE_LOG = [];
let SNAKE_SPEED = INITIAL_SPEED;
let SCORE = 0;
let HIGH_SCORE = parseInt(localStorage.getItem("zzznake_high_score") || "0", 10);

/**
 * Score display
 */

const scoreEl = document.createElement("div");
scoreEl.id = "score-display";
scoreEl.style.cssText =
  "color: #aaa; font-family: monospace; font-size: 16px; padding: 8px 0; display: flex; justify-content: space-between; width: " +
  unit * dimensions.width +
  "px; margin: 0 auto;";
document.getElementById("app").appendChild(scoreEl);

const updateScore = () => {
  scoreEl.textContent = GAME_STARTED
    ? `Score: ${SCORE}  |  High Score: ${HIGH_SCORE}`
    : `High Score: ${HIGH_SCORE}  |  Press ENTER to start`;
};

/**
 * Draw the board
 */

createDivElement("board", {
  height: `${unit * dimensions.height}px`,
  width: `${unit * dimensions.width}px`,
  position: "relative",
  fontSize: "0",
  margin: "0 auto",
  borderRadius: "4px",
  overflow: "hidden",
});

/**
 * Draw the grid with a good ol' for loop
 */

for (let i = 0; i < dimensions.height; i++) {
  for (let j = 0; j < dimensions.width; j++) {
    createDivElement(
      `${i + 1}.${j + 1}`,
      {
        width: `${unit}px`,
        height: `${unit}px`,
        display: "inline-block",
        background: bgColor,
      },
      "board"
    );
  }
}

/**
 * Draw the snake
 */

const showSnake = () => {
  const body = takeRight(SNAKE_LOG, snake.body);
  body.forEach(({ x, y }, i) => {
    const isHead = i === body.length - 1;
    setDivColor(isHead ? "#4cff4c" : "#2eb82e", x, y);
  });
};

const hideSnake = () =>
  setDivsColor(takeRight(SNAKE_LOG, snake.body), bgColor);

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
 * Opposite directions map — prevent 180-degree turns
 */

const opposites = {
  left: "right",
  right: "left",
  up: "down",
  down: "up",
};

/**
 * Set key events
 */

const setSnakeDirection = (direction) => {
  if (SNAKE_DIRECTION && opposites[direction] === SNAKE_DIRECTION) return;
  SNAKE_DIRECTION = direction;
};

const keyFunctions = ({ keyCode }) => {
  switch (keyCode) {
    case keys.ENTER:
      if (GAME_STARTED) return;
      startGame();
      break;
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
    return makeFood();
  }

  food.x = x;
  food.y = y;

  setDivColor("#ff4444", x, y);
};

/**
 * Check if snake is eating
 */

const checkIfSnakeIsEating = (snake, food) => {
  if (snake.x === food.x && snake.y === food.y) {
    snake.body = snake.body + 1;
    SCORE += 10;
    SNAKE_SPEED = Math.max(MIN_SPEED, SNAKE_SPEED - 5);
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
    gameOver();
  }
};

/**
 * Game over
 */

const gameOver = () => {
  GAME_STARTED = false;
  clearTimeout(GAME_RUNNING);

  if (SCORE > HIGH_SCORE) {
    HIGH_SCORE = SCORE;
    localStorage.setItem("zzznake_high_score", String(HIGH_SCORE));
  }

  startScreen();
};

/**
 * Reset game state
 */

const resetGame = () => {
  SNAKE_LOG = [];
  SNAKE_SPEED = INITIAL_SPEED;
  SNAKE_DIRECTION = "right";
  SCORE = 0;
  snake.x = config.snake.x;
  snake.y = config.snake.y;
  snake.body = config.snake.body;
  food.x = null;
  food.y = null;
  clearBoard(dimensions, bgColor);
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
  updateScore();
};

/**
 * Run game
 */

const startGame = () => {
  resetGame();
  updateScore();

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
