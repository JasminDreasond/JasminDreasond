import { mobileAndTabletCheck } from './utils.js';

/**
 * @param {boolean} isNight
 */
export const initializePonies = (isNight) => {
  if (!mobileAndTabletCheck() && typeof BrowserPonies !== 'undefined') {
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
};
