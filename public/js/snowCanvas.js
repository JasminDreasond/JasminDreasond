/**
 * @fileoverview SnowCanvas.
 * @author Yasmin Seidel (JasminDreasond)
 * @contributor Gemini (AI Assistant by Google)
 */

/**
 * @typedef {Object} SnowConfig
 * @property {number} [maxParticles]
 * @property {number} [baseFallSpeed]
 * @property {number} [baseWindSpeed]
 * @property {number} [mouseInfluence]
 * @property {number} [swayAmount]
 * @property {number} [swaySpeed]
 * @property {string} [snowflakeText]
 * @property {string} [fontFamily]
 * @property {number} [minSize]
 * @property {number} [maxSize]
 * @property {number} [minOpacity]
 * @property {number} [maxOpacity]
 */

/**
 * @typedef {Object} Snowflake
 * @property {number} x
 * @property {number} y
 * @property {number} size
 * @property {number} speedY
 * @property {number} speedX
 * @property {number} swayAngle
 * @property {number} opacity
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {SnowConfig} [customConfig]
 * @returns {{ updateConfig: (newConfig: Partial<SnowConfig>) => void, destroy: () => void }}
 */
export const initSnowCanvas = (canvas, customConfig = {}) => {
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext('2d');

  /** @type {number} */
  let width = window.innerWidth;

  /** @type {number} */
  let height = window.innerHeight;

  /** @type {SnowConfig} */
  let config = {
    maxParticles: 150,
    baseFallSpeed: 50,
    baseWindSpeed: 0,
    mouseInfluence: 100,
    swayAmount: 30,
    swaySpeed: 1.5,
    snowflakeText: '❄',
    fontFamily: 'Arial, sans-serif',
    minSize: 10,
    maxSize: 25,
    minOpacity: 0.3,
    maxOpacity: 0.8,
    ...customConfig,
  };

  /** @type {Snowflake[]} */
  let particles = [];

  /** @type {number} */
  let targetWindX = 0;

  /** @type {number} */
  let currentWindX = 0;

  /** @type {number} */
  let lastTime = 0;

  /** @type {number} */
  let animationFrameId;

  const createSnowflake = () => {
    /** @type {number} */
    const scale = Math.random();

    return {
      x: Math.random() * width,
      y: Math.random() * height * -1,
      size: config.minSize + scale * (config.maxSize - config.minSize),
      speedY: config.baseFallSpeed + scale * config.baseFallSpeed * 0.5,
      speedX: config.baseWindSpeed,
      swayAngle: Math.random() * Math.PI * 2,
      opacity: config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity),
    };
  };

  const initParticles = () => {
    particles = [];
    for (let i = 0; i < config.maxParticles; i++) {
      particles.push(createSnowflake());
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
    targetWindX = normalizedX * config.mouseInfluence;
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

    for (let i = 0; i < particles.length; i++) {
      /** @type {Snowflake} */
      const p = particles[i];

      p.swayAngle += config.swaySpeed * dt;

      p.y += p.speedY * dt;
      p.x += (p.speedX + Math.sin(p.swayAngle) * config.swayAmount + currentWindX) * dt;

      if (p.y > height + p.size || p.x < -p.size || p.x > width + p.size) {
        particles[i] = createSnowflake();
        particles[i].y = -p.size;
        if (currentWindX > 0 && Math.random() > 0.5) {
          particles[i].x = -p.size;
          particles[i].y = Math.random() * height;
        } else if (currentWindX < 0 && Math.random() > 0.5) {
          particles[i].x = width + p.size;
          particles[i].y = Math.random() * height;
        }
      }

      ctx.font = `${p.size}px ${config.fontFamily}`;
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.snowflakeText, p.x, p.y);
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
     * @param {Partial<SnowConfig>} newConfig
     */
    updateConfig: (newConfig) => {
      config = { ...config, ...newConfig };
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

/** @type {HTMLCanvasElement | null} */
const snowCanvasElement = document.getElementById('snow-canvas');

/** @type {ReturnType<typeof initSnowCanvas> | null} */
let snowController = null;

if (snowCanvasElement && moment().month() >= 10) {
  snowController = initSnowCanvas(snowCanvasElement, {
    maxParticles: 200, // Intensidade total
    baseFallSpeed: 80, // Velocidade base da queda
    baseWindSpeed: 10, // Vento constante (positivo para a direita)
    mouseInfluence: 150, // O quanto o mouse empurra a neve
    swayAmount: 40, // O quanto o floco balança para os lados
    snowflakeText: '❄', // Pode ser '•', '*', '❅', etc.
    fontFamily: 'monospace',
    minSize: 8,
    maxSize: 22,
    minOpacity: 0.2,
    maxOpacity: 0.9,
  });
}

export { snowController };
