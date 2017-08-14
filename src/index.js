
import config from './config';
import { createDivElement } from './utils/create-div-element';
import _ from 'lodash';

const { dimensions, unit, snake, food } = config;

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
      background: '#eee',
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
      'deeppink',
      (logEvent || {}).x,
      (logEvent || {}).y,
    );
  }
};

const hideSnake = () => {
  for(var i = 0; i < snake.body; i++) {
    const logEvent = snake.log[snake.log.length - (1 + snake.body + i)];

    setBrickColor(
      '#eee',
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
    snake.y = 50;
  }

  if (snake.x < 1) {
    snake.x = 50;
  }

  if (snake.x > 50) {
    snake.x = 1;
  }

  if (snake.y > 50) {
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
  const x = _.random(50);
  const y = _.random(50);

  food.x = x;
  food.y = y;

  setBrickColor('blue', x, y);
};

/**
 * Check if snake is eating
 */

const checkIfSnakeIsEating = () => {
  if (snake.x === food.x && snake.y === food.y) {
    makeFood();
    snake.body = snake.body + 1;
    snake.speed = snake.speed - 23;
  }
};

/**
 * Run game
 */

setInterval(() => {
  moveSnake(snake.direction);
  checkIfSnakeIsEating();
}, snake.speed);

makeFood();

