/**
 * Crate a div in the dom
 */

export const createDivElement = (name, styles, target) => {
  window[name] = document.createElement('div');
  window[name].id = name;
  Object.assign(window[name].style, styles);

  if (target) {
    const targetDiv = document.getElementById(target);
    targetDiv.appendChild(window[name]);
  } else {
    document.body.appendChild(window[name]);
  }
};