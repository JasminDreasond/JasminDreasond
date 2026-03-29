/**
 * @fileoverview RainCanvas with Dynamic Weather System.
 * @author Yasmin Seidel (JasminDreasond)
 * @contributor Gemini (AI Assistant)
 */

/**
 * @typedef {Object} RainConfig
 * @property {number} [maxParticles]
 * @property {number} [baseFallSpeed]
 * @property {number} [baseWindSpeed]
 * @property {number} [mouseInfluence]
 * @property {number} [minSize]
 * @property {number} [maxSize]
 * @property {number} [minOpacity]
 * @property {number} [maxOpacity]
 * @property {string} [rainColor]
 */

/**
 * @typedef {Object} Raindrop
 * @property {number} x
 * @property {number} y
 * @property {number} length
 * @property {number} size
 * @property {number} speedY
 * @property {number} speedX
 * @property {number} opacity
 */

/**
 * @typedef {Object} WeatherState
 * @property {number} timestamp
 * @property {boolean} isRaining
 * @property {string} intensity - 'light', 'moderate', or 'heavy'
 * @property {number} windSpeed
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {RainConfig} [customConfig]
 * @returns {{ updateConfig: (newConfig: Partial<RainConfig>) => void, destroy: () => void }}
 */
export const initRainCanvas = (canvas, customConfig = {}) => {
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext('2d');

  /** @type {number} */
  let width = window.innerWidth;

  /** @type {number} */
  let height = window.innerHeight;

  /** @type {RainConfig} */
  let config = {
    maxParticles: 100,
    baseFallSpeed: 600,
    baseWindSpeed: 0,
    mouseInfluence: 50,
    minSize: 1,
    maxSize: 2,
    minOpacity: 0.4,
    maxOpacity: 0.8,
    rainColor: '174, 194, 224',
    ...customConfig,
  };

  /** @type {Raindrop[]} */
  let particles = [];

  /** @type {number} */
  let targetWindX = config.baseWindSpeed;

  /** @type {number} */
  let currentWindX = config.baseWindSpeed;

  /** @type {number} */
  let lastTime = 0;

  /** @type {number} */
  let animationFrameId;

  const createRaindrop = () => {
    /** @type {number} */
    const scale = Math.random();

    return {
      x: Math.random() * width,
      y: Math.random() * height * -1,
      length: 10 + scale * 20,
      size: config.minSize + scale * (config.maxSize - config.minSize),
      speedY: config.baseFallSpeed + scale * config.baseFallSpeed * 0.5,
      speedX: config.baseWindSpeed,
      opacity: config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity),
    };
  };

  const initParticles = () => {
    particles = [];
    for (let i = 0; i < config.maxParticles; i++) {
      particles.push(createRaindrop());
      particles[i].y = Math.random() * height;
    }
  };

  /**
   * @param {MouseEvent} e
   */
  const handleMouseMove = (e) => {
    /** @type {number} */
    const mouseX = e.clientX;
    /** @type {number} */
    const normalizedX = (mouseX / width) * 2 - 1;
    targetWindX = config.baseWindSpeed + normalizedX * config.mouseInfluence;
  };

  const handleResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };

  /**
   * @param {number} dt
   */
  const updateAndDraw = (dt) => {
    ctx.clearRect(0, 0, width, height);

    currentWindX += (targetWindX - currentWindX) * 2 * dt;

    ctx.lineCap = 'round';

    for (let i = 0; i < particles.length; i++) {
      /** @type {Raindrop} */
      const p = particles[i];

      p.y += p.speedY * dt;
      p.x += (p.speedX + currentWindX) * dt;

      if (p.y > height + p.length || p.x < -p.length || p.x > width + p.length) {
        particles[i] = createRaindrop();
        particles[i].y = -p.length;

        if (currentWindX > 0 && Math.random() > 0.5) {
          particles[i].x = -p.length;
          particles[i].y = Math.random() * height;
        } else if (currentWindX < 0 && Math.random() > 0.5) {
          particles[i].x = width + p.length;
          particles[i].y = Math.random() * height;
        }
      }

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + currentWindX * 0.05, p.y + p.length);
      ctx.strokeStyle = `rgba(${config.rainColor}, ${p.opacity})`;
      ctx.lineWidth = p.size;
      ctx.stroke();
    }
  };

  /**
   * @param {number} time
   */
  const animate = (time) => {
    /** @type {number} */
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    if (dt < 0.1) {
      updateAndDraw(dt);
    }

    animationFrameId = requestAnimationFrame(animate);
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);

  handleResize();
  initParticles();
  animationFrameId = requestAnimationFrame(animate);

  return {
    /**
     * @param {Partial<RainConfig>} newConfig
     */
    updateConfig: (newConfig) => {
      config = { ...config, ...newConfig };
      targetWindX = config.baseWindSpeed;
      if (particles.length !== config.maxParticles) {
        initParticles();
      }
    },
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.clearRect(0, 0, width, height);
    },
  };
};

/**
 * @returns {WeatherState}
 */
const calculateWeather = () => {
  /** @type {number} */
  const chance = Math.random();

  /** @type {boolean} */
  const isRaining = chance <= 0.3;

  /** @type {string} */
  let intensity = 'none';

  /** @type {number} */
  let windSpeed = 0;

  if (isRaining) {
    /** @type {number} */
    const intensityChance = Math.random();

    if (intensityChance > 0.9) {
      intensity = 'heavy';
    } else if (intensityChance > 0.6) {
      intensity = 'moderate';
    } else {
      intensity = 'light';
    }

    windSpeed = (Math.random() - 0.5) * 400;
  }

  return {
    timestamp: Date.now(),
    isRaining,
    intensity,
    windSpeed,
  };
};

/**
 * @returns {WeatherState}
 */
const getOrUpdateWeatherState = () => {
  /** @type {number} */
  const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

  /** @type {string | null} */
  const savedStateStr = localStorage.getItem('local_weather_state');

  if (savedStateStr) {
    try {
      /** @type {WeatherState} */
      const savedState = JSON.parse(savedStateStr);
      /** @type {number} */
      const timePassed = Date.now() - savedState.timestamp;

      if (timePassed < FOUR_HOURS_MS) {
        return savedState;
      }
    } catch (e) {
      console.error('Failed to parse weather state:', e);
    }
  }

  /** @type {WeatherState} */
  const newState = calculateWeather();
  localStorage.setItem('local_weather_state', JSON.stringify(newState));

  return newState;
};

/** @type {HTMLCanvasElement | null} */
const rainCanvasElement = document.getElementById('rain-canvas');

/** @type {ReturnType<typeof initRainCanvas> | null} */
let rainController = null;

if (rainCanvasElement) {
  /** @type {WeatherState} */
  const weather = getOrUpdateWeatherState();

  if (weather.isRaining) {
    /** @type {RainConfig} */
    let weatherConfig = {};

    switch (weather.intensity) {
      case 'light':
        weatherConfig = { maxParticles: 150, baseFallSpeed: 500 };
        break;
      case 'moderate':
        weatherConfig = { maxParticles: 400, baseFallSpeed: 700 };
        break;
      case 'heavy':
        weatherConfig = { maxParticles: 800, baseFallSpeed: 1000, minSize: 2, maxSize: 3 };
        break;
    }

    weatherConfig.baseWindSpeed = weather.windSpeed;

    rainController = initRainCanvas(rainCanvasElement, weatherConfig);
  }
}

export { rainController };
