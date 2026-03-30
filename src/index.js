import { random } from "lodash";
import config from "./config";
import {
  createDivElement,
  setDivColor,
  setDivsColor,
  drawLetter,
} from "./utils/div";
import keys from "./utils/keys";
import { S, N, A, K, E } from "./utils/letters";
import {
  createGameState,
  moveSnake as moveSnakeCore,
  setSnakeDirection as setDir,
  checkCollision,
  checkIfSnakeIsEating,
  generateFoodPosition,
  getSnakeBody,
} from "./game.js";

const { dimensions, unit, bgColor } = config;

const state = createGameState(config);
const { snake, food } = state;

let GAME_STARTED = false;
let GAME_RUNNING;
let SNAKE_DIRECTION;

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
        background: bgColor,
      },
      "board"
    );
  }
}

/**
 * Draw the snake
 */

const showSnake = () => setDivsColor(getSnakeBody(state), "yellow");

const hideSnake = () => setDivsColor(getSnakeBody(state), "black");

/**
 * Move the snake
 */

const moveSnake = (direction) => {
  hideSnake();
  moveSnakeCore(state, direction);
  showSnake();
};

/**
 * Set key events
 */

const setSnakeDirection = (direction) => {
  SNAKE_DIRECTION = direction;
  setDir(state, direction);
};

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
  const pos = generateFoodPosition(state, random);
  food.x = pos.x;
  food.y = pos.y;
  setDivColor("red", pos.x, pos.y);
};

/**
 * Check if snake is eating
 */

const checkIfSnakeIsEatingAndFeed = () => {
  if (checkIfSnakeIsEating(state)) {
    makeFood();
  }
};

/**
 * Check collision
 */

const checkCollisionAndEnd = () => {
  if (checkCollision(state)) {
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
    checkCollisionAndEnd();
    checkIfSnakeIsEatingAndFeed();
    GAME_RUNNING = setTimeout(runGame, state.snakeSpeed);
  };

  GAME_STARTED = true;
  makeFood();
  runGame();
};

startScreen();
