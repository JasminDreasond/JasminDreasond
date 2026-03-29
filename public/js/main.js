import { setupTimezone, toggleDarkMode } from './utils.js';
import './skyCanvas.js';
import './snowCanvas.js';

import { initializePonies } from './ponies.js';

document.addEventListener('DOMContentLoaded', () => {
  /** @type {moment.Moment} */
  const timeNow = moment();
  /** @type {number} */
  const hour = timeNow.hour();

  /** @type {boolean} */
  const isNight = hour >= 19 || hour <= 4;
  toggleDarkMode(isNight);

  if (typeof window.ethereum !== 'undefined') document.body.classList.add('web3-mode');
  setupTimezone();
  initializePonies(isNight);

  document.body.classList.remove('loading-page');
});
