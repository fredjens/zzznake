/**
 * Crate a div in the dom
 */

export const createDivElement = (name, styles, target) => {
  eval[name] = document.createElement('div');
  eval[name].id = name;
  Object.assign(eval[name].style, styles);

  if (target) {
    const targetDiv = document.getElementById(target);
    targetDiv.appendChild(eval[name]);
  } else {
    document.body.appendChild(eval[name]);
  }
};