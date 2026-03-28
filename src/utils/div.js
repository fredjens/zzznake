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

export const setDivColor = (color, x, y, className) => {
  const el = document.getElementById(`${x}.${y}`);
  if (!el) return;
  el.style.background = color;
  // Clear 3D classes
  el.classList.remove('cell-snake', 'cell-food', 'cell-letter');
  if (className) {
    el.classList.add(className);
  }
};

/**
 * Set the color of multiple divs in the Grid
 */

export const setDivsColor = (divs, color, className) => {
  divs.forEach(({ x, y }) => {
    setDivColor(color, x, y, className);
  });
};

/**
* Draw charchter
*/

export const drawLetter = (char) => {
  const x = char.toString().split('.')[0];
  const y = char.toString().split('.')[1];
  setDivColor('#6c5ce7', x, y, 'cell-letter');
};
