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

const { dimensions, unit, snake, food } = config;

let GAME_STARTED = false;
let GAME_RUNNING;
let SNAKE_DIRECTION;
let SNAKE_LOG = [];
let SNAKE_SPEED = 100;

/**
 * Draw the board
 */

createDivElement("board", {
  height: `${unit * dimensions.height}px`,
  width: `${unit * dimensions.width}px`,
  position: "relative",
  fontSize: "0",
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
        background: "blue",
      },
      "board"
    );
  }
}

/**
 * Draw the snake
 */

const showSnake = () =>
  setDivsColor(takeRight(SNAKE_LOG, snake.body), "yellow");

const hideSnake = () => setDivsColor(takeRight(SNAKE_LOG, snake.body), "black");

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

  setDivColor("red", x, y);
};

/**
 * Check if snake is eating
 */

const checkIfSnakeIsEating = (snake, food) => {
  if (snake.x === food.x && snake.y === food.y) {
    snake.body = snake.body + 1;
    SNAKE_SPEED = SNAKE_SPEED - 10;
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
    startScreen();
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
