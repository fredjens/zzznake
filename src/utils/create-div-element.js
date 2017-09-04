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