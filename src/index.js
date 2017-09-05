import { random, find } from 'lodash';
import config from './config';
import { createDivElement, setDivColor, drawLetter } from './utils/div';
import { S, N, A, K, E } from './utils/letters';

const { dimensions, unit, snake, food } = config;

let GAME_STARTED = false;
let GAME_RUNNING;

/**
 * Draw the board
 */

createDivElement('board', {
  height: `${unit * dimensions.height}px`,
  width: `${unit * dimensions.width}px`,
  position: 'relative',
  fontSize: '0',
});

/**
 * Draw the grid
 */

for (let i = 0; i < dimensions.height; i++) {
  for (let j = 0; j < dimensions.width; j++) {
    createDivElement(`${i + 1}.${j + 1}`, {
      width: `${unit}px`,
      height: `${unit}px`,
      display: 'inline-block',
      background: '#000',
    }, 'board');
  }
}

/**
 * Draw the snake
 */

const showSnake = () => {
  for(var i = 0; i < snake.body; i++) {
    const logEvent = snake.log[snake.log.length - (1 + i)];

    setDivColor(
      'yellow',
      (logEvent || {}).x,
      (logEvent || {}).y,
    );
  }
};

const hideSnake = () => {
  for(var i = 0; i < snake.body; i++) {
    const logEvent = snake.log[snake.log.length - (1 + snake.body + i)];

    setDivColor(
      '#000',
      (logEvent || {}).x,
      (logEvent || {}).y,
    );
  }
};

/**
 * Move the snake
 */

const pushToSnakeLog = (cords) => {
  snake.log.push(cords);
};

const moveSnake = (direction) => {
  hideSnake(`${snake.x}.${snake.y}`);

  if (direction === 'left') {
    snake.y--;
  }

  if (direction === 'up') {
    snake.x--;
  }

  if (direction === 'right') {
    snake.y++;
  }

  if (direction === 'down') {
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

  showSnake(`${snake.x}.${snake.y}`);

  pushToSnakeLog({
    x: snake.x,
    y: snake.y,
  });
};

/**
 * Set key events
 */

const setSnakeDirection = (direction) => snake.direction = direction;

document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 13:
      if (GAME_STARTED) {
        return;
      }
      startGame();
    case 37:
      setSnakeDirection('left');
      break;
    case 38:
      setSnakeDirection('up');
      break;
    case 39:
      setSnakeDirection('right');
      break;
    case 40:
      setSnakeDirection('down');
      break;
  }
};

/**
 * Make food
 */

const makeFood = () => {
  const x = random(1, config.dimensions.width);
  const y = random(1, config.dimensions.height);

  const snakeLength = snake.log.length - 1;
  const snakeBody = snake.log.slice((snakeLength - snake.body), snakeLength);

  if (find(snakeBody, { x, y })) {
    console.log('food placed under the snake...');
    /**
     * So we made food again... yolo
     */

    return makeFood();
  }

  food.x = x;
  food.y = y;

  setDivColor('red', x, y);
};

/**
 * Check if snake is eating
 */

const checkIfSnakeIsEating = (snake, food) => {
  if (snake.x === food.x && snake.y === food.y) {

    /**
     * Make snake larger and go faster
     */
    snake.body = snake.body + 1;
    snake.speed = snake.speed + 100;

    /**
     * Put out new food
     */
    makeFood();
  }
};

/**
 * Check collision
 */

const checkCollision = ({ x, y }) => {
  const snakeLength = snake.log.length - 2;
  const snakeBody = snake.log.slice((snakeLength - snake.body), snakeLength);

  if (find(snakeBody, { x, y })) {
    GAME_STARTED = false;
    clearInterval(GAME_RUNNING);
    startScreen();
  }
}

/**
 * Start screen
 */

const startScreen = () => {
  S.forEach(drawLetter);
  N.forEach(drawLetter);
  A.forEach(drawLetter);
  K.forEach(drawLetter);
  E.forEach(drawLetter);
}

/**
 * Run game
 */


const startGame = () => {
  GAME_STARTED = true;
  makeFood();
  showSnake();

  GAME_RUNNING = setInterval(() => {
    console.log('running');
    checkCollision(snake);
    moveSnake(snake.direction);
    checkIfSnakeIsEating(snake, food);
  }, snake.speed);
};

startScreen();

