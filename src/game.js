import { find, takeRight } from "lodash";

/**
 * Create a fresh game state
 */
export const createGameState = (config) => ({
  snake: { ...config.snake },
  food: { ...config.food },
  dimensions: { ...config.dimensions },
  snakeLog: [],
  snakeSpeed: 100,
  gameStarted: false,
  direction: null,
});

/**
 * Push coordinates to the snake log
 */
export const pushToSnakeLog = (state, coords) => {
  state.snakeLog.push(coords);
};

/**
 * Move the snake in the given direction, wrapping at board edges.
 * Mutates state.snake position and appends to snakeLog.
 */
export const moveSnake = (state, direction) => {
  const { snake, dimensions } = state;

  if (direction === "left") snake.y--;
  if (direction === "up") snake.x--;
  if (direction === "right") snake.y++;
  if (direction === "down") snake.x++;

  if (snake.y < 1) snake.y = dimensions.height;
  if (snake.x < 1) snake.x = dimensions.width;
  if (snake.x > dimensions.width) snake.x = 1;
  if (snake.y > dimensions.height) snake.y = 1;

  pushToSnakeLog(state, { x: snake.x, y: snake.y });
};

/**
 * Set the snake direction
 */
export const setSnakeDirection = (state, direction) => {
  state.direction = direction;
};

/**
 * Check if the snake head collides with its body.
 * Returns true if collision detected.
 */
export const checkCollision = (state) => {
  const { snake, snakeLog } = state;
  const snakeLength = snakeLog.length - 2;
  const snakeBody = snakeLog.slice(snakeLength - snake.body, snakeLength);

  return !!find(snakeBody, { x: snake.x, y: snake.y });
};

/**
 * Check if the snake is eating food.
 * If so, grows the body and increases speed. Returns true if eating.
 */
export const checkIfSnakeIsEating = (state) => {
  const { snake, food } = state;
  if (snake.x === food.x && snake.y === food.y) {
    snake.body = snake.body + 1;
    state.snakeSpeed = state.snakeSpeed - 10;
    return true;
  }
  return false;
};

/**
 * Generate a food position that doesn't overlap the snake body.
 * Takes a randomFn(min, max) for testability.
 */
export const generateFoodPosition = (state, randomFn) => {
  const { snakeLog, snake } = state;
  const snakeLength = snakeLog.length - 1;
  const snakeBody = snakeLog.slice(snakeLength - snake.body, snakeLength);

  const x = randomFn(1, state.dimensions.width);
  const y = randomFn(1, state.dimensions.height);

  if (find(snakeBody, { x, y })) {
    return generateFoodPosition(state, randomFn);
  }

  return { x, y };
};

/**
 * Get the visible snake body segments (the last N entries in the log)
 */
export const getSnakeBody = (state) => {
  return takeRight(state.snakeLog, state.snake.body);
};
