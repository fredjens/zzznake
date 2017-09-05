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
* Draw charchter
*/

export const drawLetter = (char) => {
  setDivColor('#333', char.toString().split('.')[0], char.toString().split('.')[1]);
};