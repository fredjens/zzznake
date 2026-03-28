/**
 * Crate a div in the dom
 */

export const createDivElement = (name, styles, target) => {
  window[name] = document.createElement('div');
  window[name].id = name;

  Object.assign(window[name].style, styles);

  if (!target) {
    return document.body.appendChild(window[name]);
  }

  return document.getElementById(target).appendChild(window[name]);
};

/**
 * Set the color of a div in the Grid
 */

export const setDivColor = (color, x, y) => {
  ((document.getElementById(`${x}.${y}`) || {}).style || {}).background = color;
};

/**
 * Set the color of a div in the Grid
 */

export const setDivsColor = (divs, color) => {
  divs.forEach(({ x, y }) => {
    ((document.getElementById(`${x}.${y}`) || {}).style || {}).background = color;
  });
};

/**
 * Clear the board back to background color
 */

export const clearBoard = (dimensions, bgColor) => {
  for (let i = 1; i <= dimensions.height; i++) {
    for (let j = 1; j <= dimensions.width; j++) {
      const el = document.getElementById(`${i}.${j}`);
      if (el) el.style.background = bgColor;
    }
  }
};

/**
* Draw charchter
*/

export const drawLetter = (char) => {
  setDivColor('#555', char.toString().split('.')[0], char.toString().split('.')[1]);
};