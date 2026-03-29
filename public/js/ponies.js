import { checkMobile, toggleDarkMode } from './utils.js';

export const initializePoniesAndSnow = () => {
  /** @type {moment.Moment} */
  const timeNow = moment();
  /** @type {number} */
  const hour = timeNow.hour();
  /** @type {number} */
  const month = timeNow.month();

  /** @type {boolean} */
  const isNight = hour >= 19 || hour <= 4;
  toggleDarkMode(isNight);

  if (typeof snowStorm !== 'undefined') {
    if (month >= 10) snowStorm.resume();
    else snowStorm.stop();
  }

  if (!checkMobile() && typeof BrowserPonies !== 'undefined') {
    /** @type {Object<string, number>} */
    const spawnPonies = { sphinx: 1 };
    spawnPonies[isNight ? 'flutterbat' : 'fluttershy'] = 1;

    (function (cfg) {
      BrowserPonies.setBaseUrl(cfg.baseurl);
      BrowserPonies.loadConfig(BrowserPoniesBaseConfig);
      BrowserPonies.loadConfig(cfg);
    })({
      baseurl: 'https://browser.pony.house/',
      allowDoubleClickControl: true,
      fadeDuration: 500,
      volume: 1,
      fps: 60,
      speed: 3,
      audioEnabled: false,
      showFps: false,
      showLoadProgress: true,
      speakProbability: 0.1,
      spawn: spawnPonies,
      autostart: true,
    });
  }

  if (typeof window.ethereum !== 'undefined') {
    document.body.classList.add('web3-mode');
  }
  document.body.classList.remove('loading-page');
};
