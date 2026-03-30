import { describe, it, expect, beforeEach } from "vitest";
import {
  createGameState,
  moveSnake,
  pushToSnakeLog,
  setSnakeDirection,
  checkCollision,
  checkIfSnakeIsEating,
  generateFoodPosition,
  getSnakeBody,
} from "./game.js";

const defaultConfig = {
  dimensions: { width: 30, height: 30 },
  snake: { x: 15, y: 15, body: 2 },
  food: { x: null, y: null },
};

describe("createGameState", () => {
  it("creates a fresh state from config", () => {
    const state = createGameState(defaultConfig);
    expect(state.snake).toEqual({ x: 15, y: 15, body: 2 });
    expect(state.food).toEqual({ x: null, y: null });
    expect(state.snakeLog).toEqual([]);
    expect(state.snakeSpeed).toBe(100);
    expect(state.gameStarted).toBe(false);
  });

  it("does not mutate the original config", () => {
    const state = createGameState(defaultConfig);
    state.snake.x = 99;
    expect(defaultConfig.snake.x).toBe(15);
  });
});

describe("moveSnake", () => {
  let state;
  beforeEach(() => {
    state = createGameState(defaultConfig);
  });

  it("moves left (decrements y)", () => {
    moveSnake(state, "left");
    expect(state.snake).toMatchObject({ x: 15, y: 14 });
  });

  it("moves right (increments y)", () => {
    moveSnake(state, "right");
    expect(state.snake).toMatchObject({ x: 15, y: 16 });
  });

  it("moves up (decrements x)", () => {
    moveSnake(state, "up");
    expect(state.snake).toMatchObject({ x: 14, y: 15 });
  });

  it("moves down (increments x)", () => {
    moveSnake(state, "down");
    expect(state.snake).toMatchObject({ x: 16, y: 15 });
  });

  it("appends position to snakeLog", () => {
    moveSnake(state, "right");
    moveSnake(state, "right");
    expect(state.snakeLog).toEqual([
      { x: 15, y: 16 },
      { x: 15, y: 17 },
    ]);
  });

  describe("boundary wrapping", () => {
    it("wraps left edge to right", () => {
      state.snake.y = 1;
      moveSnake(state, "left");
      expect(state.snake.y).toBe(30);
    });

    it("wraps right edge to left", () => {
      state.snake.y = 30;
      moveSnake(state, "right");
      expect(state.snake.y).toBe(1);
    });

    it("wraps top edge to bottom", () => {
      state.snake.x = 1;
      moveSnake(state, "up");
      expect(state.snake.x).toBe(30);
    });

    it("wraps bottom edge to top", () => {
      state.snake.x = 30;
      moveSnake(state, "down");
      expect(state.snake.x).toBe(1);
    });
  });
});

describe("pushToSnakeLog", () => {
  it("appends coordinates to the log", () => {
    const state = createGameState(defaultConfig);
    pushToSnakeLog(state, { x: 1, y: 2 });
    pushToSnakeLog(state, { x: 3, y: 4 });
    expect(state.snakeLog).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]);
  });
});

describe("setSnakeDirection", () => {
  it("sets the direction on state", () => {
    const state = createGameState(defaultConfig);
    setSnakeDirection(state, "up");
    expect(state.direction).toBe("up");
  });
});

describe("checkCollision", () => {
  it("returns false when no collision", () => {
    const state = createGameState(defaultConfig);
    // Build a straight line - no overlap
    for (let i = 0; i < 5; i++) {
      moveSnake(state, "right");
    }
    expect(checkCollision(state)).toBe(false);
  });

  it("returns true when snake hits itself", () => {
    const state = createGameState({
      ...defaultConfig,
      snake: { x: 15, y: 15, body: 5 },
    });
    // Collision checks slice(len-2-body, len-2) against head (last entry).
    // With 9 moves: body range = indices 2-6, head = index 8.
    moveSnake(state, "right"); // idx 0: (15,16)
    moveSnake(state, "right"); // idx 1: (15,17)
    moveSnake(state, "down");  // idx 2: (16,17) ← in body
    moveSnake(state, "left");  // idx 3: (16,16) ← in body
    moveSnake(state, "left");  // idx 4: (16,15) ← in body
    moveSnake(state, "down");  // idx 5: (17,15) ← in body
    moveSnake(state, "right"); // idx 6: (17,16) ← in body
    moveSnake(state, "right"); // idx 7: (17,17)
    moveSnake(state, "up");    // idx 8: (16,17) - collides with idx 2

    expect(checkCollision(state)).toBe(true);
  });

  it("returns false with short snake that cannot self-collide", () => {
    const state = createGameState(defaultConfig);
    moveSnake(state, "right");
    moveSnake(state, "down");
    moveSnake(state, "left");
    expect(checkCollision(state)).toBe(false);
  });
});

describe("checkIfSnakeIsEating", () => {
  it("returns true and grows snake when on food", () => {
    const state = createGameState(defaultConfig);
    state.food.x = 15;
    state.food.y = 15;
    const result = checkIfSnakeIsEating(state);
    expect(result).toBe(true);
    expect(state.snake.body).toBe(3);
    expect(state.snakeSpeed).toBe(90);
  });

  it("returns false when not on food", () => {
    const state = createGameState(defaultConfig);
    state.food.x = 1;
    state.food.y = 1;
    const result = checkIfSnakeIsEating(state);
    expect(result).toBe(false);
    expect(state.snake.body).toBe(2);
    expect(state.snakeSpeed).toBe(100);
  });

  it("grows body and increases speed for each food eaten", () => {
    const state = createGameState(defaultConfig);
    state.food.x = state.snake.x;
    state.food.y = state.snake.y;

    checkIfSnakeIsEating(state);
    // Move food to new snake position
    state.food.x = state.snake.x;
    state.food.y = state.snake.y;
    checkIfSnakeIsEating(state);

    expect(state.snake.body).toBe(4);
    expect(state.snakeSpeed).toBe(80);
  });
});

describe("generateFoodPosition", () => {
  it("returns coordinates within board bounds", () => {
    const state = createGameState(defaultConfig);
    const randomFn = () => 10;
    const pos = generateFoodPosition(state, randomFn);
    expect(pos.x).toBeGreaterThanOrEqual(1);
    expect(pos.x).toBeLessThanOrEqual(30);
    expect(pos.y).toBeGreaterThanOrEqual(1);
    expect(pos.y).toBeLessThanOrEqual(30);
  });

  it("retries when food overlaps snake body", () => {
    const state = createGameState(defaultConfig);
    state.snake.body = 3;
    // Need enough entries so slice(len-1-body, len-1) captures body positions
    state.snakeLog = [
      { x: 5, y: 3 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 5, y: 7 },
    ];
    // slice(4-3, 4) = slice(1,4) = [{5,4},{5,5},{5,6}]

    // randomFn is called twice per attempt (once for x, once for y)
    const values = [5, 5, 10, 10]; // first attempt: (5,5) hits snake body, second: (10,10) is clear
    let i = 0;
    const randomFn = () => values[i++];

    const pos = generateFoodPosition(state, randomFn);
    expect(pos).toEqual({ x: 10, y: 10 });
  });

  it("places food when snake log is empty", () => {
    const state = createGameState(defaultConfig);
    const randomFn = () => 20;
    const pos = generateFoodPosition(state, randomFn);
    expect(pos).toEqual({ x: 20, y: 20 });
  });
});

describe("getSnakeBody", () => {
  it("returns the last N entries from snakeLog", () => {
    const state = createGameState(defaultConfig);
    state.snake.body = 3;
    state.snakeLog = [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 1, y: 4 },
      { x: 1, y: 5 },
    ];
    const body = getSnakeBody(state);
    expect(body).toEqual([
      { x: 1, y: 3 },
      { x: 1, y: 4 },
      { x: 1, y: 5 },
    ]);
  });

  it("returns all entries when log is shorter than body size", () => {
    const state = createGameState(defaultConfig);
    state.snake.body = 5;
    state.snakeLog = [{ x: 1, y: 1 }];
    expect(getSnakeBody(state)).toEqual([{ x: 1, y: 1 }]);
  });
});
