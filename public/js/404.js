/**
 * @typedef {Object} ErrorPageElements
 * @property {HTMLElement} pathTarget - Element that displays the requested path.
 */

/**
 * Collects the DOM elements required by the 404 page.
 *
 * @param {Document} [doc=document] - Document used to query the elements.
 * @returns {ErrorPageElements} The resolved elements.
 * @throws {TypeError} If `doc` is not a Document instance.
 * @throws {ReferenceError} If a required element is missing from the document.
 */
function getErrorPageElements(doc = document) {
  if (!(doc instanceof Document)) {
    throw new TypeError('The "doc" argument must be a Document instance.');
  }

  const pathTarget = doc.getElementById('requested-path');

  if (!(pathTarget instanceof HTMLElement)) {
    throw new ReferenceError('The element "#requested-path" was not found in the document.');
  }

  return { pathTarget };
}

/**
 * Renders the requested path inside the 404 card.
 *
 * @param {ErrorPageElements} elements - Resolved DOM elements.
 * @param {string} path - Path requested by the visitor.
 * @returns {void}
 * @throws {TypeError} If the arguments have an invalid type.
 * @throws {RangeError} If `path` is an empty string.
 */
function renderRequestedPath(elements, path) {
  if (typeof elements !== 'object' || elements === null) {
    throw new TypeError('The "elements" argument must be an object.');
  }

  if (!(elements.pathTarget instanceof HTMLElement)) {
    throw new TypeError('The "elements.pathTarget" must be an HTMLElement.');
  }

  if (typeof path !== 'string') {
    throw new TypeError('The "path" argument must be a string.');
  }

  if (path.length === 0) {
    throw new RangeError('The "path" argument cannot be empty.');
  }

  elements.pathTarget.textContent = path;
}

/**
 * Builds the full requested path, including query string and hash.
 *
 * @returns {string} The requested path, or "/" when the value is empty.
 */
function getRequestedPath() {
  const { pathname, search, hash } = window.location;
  const path = `${pathname}${search}${hash}`;

  return path.length > 0 ? path : '/';
}

try {
  renderRequestedPath(getErrorPageElements(), getRequestedPath());
} catch (error) {
  console.error('[404] Failed to render the requested path.', error);
}
