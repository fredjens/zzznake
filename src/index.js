
import config from './config';
import { createDivElement } from './utils/create-div-element';

const { dimensions, unit } = config;

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

let snake = {
  direction: 'left',
  x: 10,
  y: 10,
  body: 10,
  speed: 100,
  log: [],
};

const setSnakeColor = (color, x, y) => {
  console.log('hoi', color, x, y);
  ((document.getElementById(`${x}.${y}`) || {}).style || {}).background = color;
};

const showSnake = () => {
  for(var i = 0; i < snake.body; i++) {
    const logEvent = snake.log[snake.log.length - (1 + i)];

    setSnakeColor(
      'deeppink',
      (logEvent || {}).x,
      (logEvent || {}).y,
    );
  }
};

const hideSnake = () => {
  for(var i = 0; i < snake.body; i++) {
    const logEvent = snake.log[snake.log.length - (1 + snake.body + i)];

    setSnakeColor(
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

setInterval(() => {
  moveSnake(snake.direction);
}, snake.speed);


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
