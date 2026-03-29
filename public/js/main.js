import { setupTimezone } from './utils.js';
import './skyCanvas.js';
import { initializePoniesAndSnow } from './ponies.js';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.ethereum !== 'undefined') document.body.classList.add('web3-mode');
  setupTimezone();
  initializePoniesAndSnow();
});
