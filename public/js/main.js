import { setupTimezone } from './utils.js';
import './skyCanvas.js';
import { initializePoniesAndSnow } from './ponies.js';

document.addEventListener('DOMContentLoaded', () => {
  setupTimezone();
  initializePoniesAndSnow();
});
