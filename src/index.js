
import config from './config';
import { createDivElement } from './utils/create-div-element';
import _ from 'lodash';

const { dimensions, unit, snake, food } = config;

let GAME_STARTED = false;

/**
 * Draw the board
 */

createDivElement('board', {
  height: `${unit * dimensions.height}px`,
  width: `${unit * dimensions.width}px`,
  position: 'relative',
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

const setBrickColor = (color, x, y) => {
  ((document.getElementById(`${x}.${y}`) || {}).style || {}).background = color;
};

const showSnake = () => {
  for(var i = 0; i < snake.body; i++) {
    const logEvent = snake.log[snake.log.length - (1 + i)];

    setBrickColor(
      'yellow',
      (logEvent || {}).x,
      (logEvent || {}).y,
    );
  }
};

const hideSnake = () => {
  for(var i = 0; i < snake.body; i++) {
    const logEvent = snake.log[snake.log.length - (1 + snake.body + i)];

    setBrickColor(
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

setSnakeDirection = (direction) => snake.direction = direction;

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
  const x = _.random(1, config.dimensions.width);
  const y = _.random(1, config.dimensions.height);

  if (_.find(snakeBody, { x, y })) {
    console.log('food placed under the snake...');

    /**
    * Food was placed under the snake
    */
    return makeFood();
    /**
     * So we made food again... yolo
     */
  }

  food.x = x;
  food.y = y;

  const snakeLength = snake.log.length - 1;
  const snakeBody = snake.log.slice((snakeLength - snake.body), snakeLength);

  setBrickColor('red', x, y);
};

/**
 * Check if snake is eating
 */

const checkIfSnakeIsEating = () => {
  if (snake.x === food.x && snake.y === food.y) {
    makeFood();
    snake.body = snake.body + 1;
    snake.speed = snake.speed + 23;
  }
};

/**
 * Check collision
 */

let GAME_RUNNING;

const checkCollision = () => {
  const snakeLength = snake.log.length - 2;
  const snakeBody = snake.log.slice((snakeLength - snake.body), snakeLength);
  const snakeHead = { x: snake.x, y: snake.y };

  if (_.find(snakeBody, snakeHead)) {
    GAME_STARTED = false;
    clearInterval(GAME_RUNNING);
    startScreen();
  }
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
    checkCollision();
    moveSnake(snake.direction);
    checkIfSnakeIsEating();
  }, snake.speed);
};

const startScreen = () => {
  // S
  setBrickColor('#333', 2, 2);
  setBrickColor('#333', 2, 3);
  setBrickColor('#333', 2, 4);
  setBrickColor('#333', 2, 5);
  setBrickColor('#333', 2, 5);
  setBrickColor('#333', 3, 2);
  setBrickColor('#333', 4, 3);
  setBrickColor('#333', 5, 4);
  setBrickColor('#333', 6, 5);
  setBrickColor('#333', 7, 5);
  setBrickColor('#333', 7, 5);
  setBrickColor('#333', 7, 4);
  setBrickColor('#333', 7, 3);
  setBrickColor('#333', 7, 2);
  // N
  setBrickColor('#333', 2, 7);
  setBrickColor('#333', 3, 7);
  setBrickColor('#333', 4, 7);
  setBrickColor('#333', 5, 7);
  setBrickColor('#333', 6, 7);
  setBrickColor('#333', 7, 7);
  setBrickColor('#333', 3, 8);
  setBrickColor('#333', 4, 9);
  setBrickColor('#333', 5, 9);
  setBrickColor('#333', 6, 10);
  setBrickColor('#333', 7, 11);
  setBrickColor('#333', 6, 11);
  setBrickColor('#333', 5, 11);
  setBrickColor('#333', 4, 11);
  setBrickColor('#333', 3, 11);
  setBrickColor('#333', 2, 11);
  // A
  setBrickColor('#333', 2, 13);
  setBrickColor('#333', 3, 13);
  setBrickColor('#333', 4, 13);
  setBrickColor('#333', 5, 13);
  setBrickColor('#333', 6, 13);
  setBrickColor('#333', 7, 13);
  setBrickColor('#333', 2, 14);
  setBrickColor('#333', 2, 15);
  setBrickColor('#333', 2, 16);
  setBrickColor('#333', 2, 17);
  setBrickColor('#333', 3, 17);
  setBrickColor('#333', 4, 17);
  setBrickColor('#333', 5, 17);
  setBrickColor('#333', 6, 17);
  setBrickColor('#333', 7, 17);
  setBrickColor('#333', 5, 16);
  setBrickColor('#333', 5, 15);
  setBrickColor('#333', 5, 14);
  // K
  setBrickColor('#333', 2, 19);
  setBrickColor('#333', 3, 19);
  setBrickColor('#333', 4, 19);
  setBrickColor('#333', 5, 19);
  setBrickColor('#333', 6, 19);
  setBrickColor('#333', 7, 19);
  setBrickColor('#333', 5, 20);
  setBrickColor('#333', 6, 21);
  setBrickColor('#333', 7, 22);
  setBrickColor('#333', 4, 20);
  setBrickColor('#333', 3, 21);
  setBrickColor('#333', 2, 22);
  // E
  setBrickColor('#333', 2, 24);
  setBrickColor('#333', 3, 24);
  setBrickColor('#333', 4, 24);
  setBrickColor('#333', 5, 24);
  setBrickColor('#333', 6, 24);
  setBrickColor('#333', 7, 24);
  setBrickColor('#333', 2, 25);
  setBrickColor('#333', 2, 26);
  setBrickColor('#333', 2, 27);
  setBrickColor('#333', 2, 28);
  setBrickColor('#333', 7, 25);
  setBrickColor('#333', 7, 26);
  setBrickColor('#333', 7, 27);
  setBrickColor('#333', 7, 28);
  setBrickColor('#333', 4, 25);
}

startScreen();

