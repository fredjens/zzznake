import _ from 'lodash';
import config from './config';

import { createDivElement } from './utils/create-div-element';

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

const drawLetter = (letter) => {
  setBrickColor('#333', letter.toString().split('.')[0], letter.toString().split('.')[1]);
};

const startScreen = () => {
  // S
  [2.2, 2.3, 2.4, 2.5, 3.2, 4.3, 5.4, 6.5, 7.5, 7.4, 7.3, 7.2]
  .forEach(drawLetter);

  // N
  [2.7, 3.7, 4.7, 5.7, 6.7, 7.7, 3.8, 4.9, 5.9, 6.11, 7.11, 6.11, 5.11, 4.11, 3.11, 2.11]
  .forEach(drawLetter);
  setBrickColor('#333', 6, 10);

  // A
  [2.13, 3.13, 4.13, 5.13, 6.13, 7.13, 2.14, 2.15, 2.16, 2.17, 3.17, 4.17, 5.17, 6.17, 7.17, 5.16, 5.15, 5.14]
  .forEach(drawLetter);

  // K
  [2.19, 3.19, 4.19, 5.19, 6.19, 7.19, 6.21, 7.22, 3.21, 2.22]
  .forEach(drawLetter);
  setBrickColor('#333', 5, 20);
  setBrickColor('#333', 4, 20);

  // E
  [2.24, 3.24, 4.24, 5.24, 6.24, 7.24, 2.25, 2.26, 2.27, 2.28, 7.25, 7.26, 7.27, 7.28, 4.25]
  .forEach(drawLetter);

}

startScreen();

