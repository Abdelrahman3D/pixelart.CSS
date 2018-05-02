/**
 * Utilities
 */
export function select (element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}
export function css (element, styles) {
  Object.entries(styles).forEach(pair => {
    element.style[pair[0]] = pair[1];
  });
}
export function camelCaseToDash (myStr) {
  return myStr.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
