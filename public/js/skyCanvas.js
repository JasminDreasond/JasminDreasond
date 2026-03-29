/**
 * @param {HTMLCanvasElement} canvas
 */
export const initSkyCanvas = (canvas) => {
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext('2d');

  /** @type {number} */
  let width = window.innerWidth;

  /** @type {number} */
  let height = window.innerHeight;

  /** @type {boolean} */
  let isNightMode = false;

  /** @type {number} */
  let lastTime = 0;

  /** @type {Array<{x: number, y: number, size: number, blinkSpeed: number, alpha: number}>} */
  const stars = Array.from({ length: 400 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2,
    blinkSpeed: 0.001 + Math.random() * 0.002,
    alpha: Math.random(),
  }));

  /** @type {Array<{x: number, y: number, speed: number, length: number}>} */
  const meteors = [];

  /** @type {Array<{x: number, y: number, speed: number, scale: number, opacity: number}>} */
  const clouds = Array.from({ length: 12 }, () => ({
    x: Math.random() * width,
    y: Math.random() * (height * 0.6),
    speed: 20 + Math.random() * 50,
    scale: 0.5 + Math.random() * 1.5,
    opacity: 0.6 + Math.random() * 0.4,
  }));

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} scale
   */
  const drawCloudShape = (x, y, scale) => {
    ctx.beginPath();
    ctx.arc(x, y, 20 * scale, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + 25 * scale, y - 15 * scale, 30 * scale, Math.PI * 1, Math.PI * 2);
    ctx.arc(x + 60 * scale, y - 10 * scale, 25 * scale, Math.PI * 1, Math.PI * 2);
    ctx.arc(x + 85 * scale, y, 20 * scale, Math.PI * 1.5, Math.PI * 0.5);
    ctx.rect(x, y - 20 * scale, 85 * scale, 40 * scale);
    ctx.closePath();
    ctx.fill();
  };

  /**
   * @param {number} dt
   */
  const render = (dt) => {
    ctx.clearRect(0, 0, width, height);

    // Background Gradient
    /** @type {CanvasGradient} */
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isNightMode) {
      gradient.addColorStop(0, '#010012');
      gradient.addColorStop(0.5, '#120d1b');
      gradient.addColorStop(1, '#191327');
    } else {
      gradient.addColorStop(0, '#93d4f7');
      gradient.addColorStop(1, '#d4f1ff');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (isNightMode) {
      // Draw Moon
      ctx.shadowBlur = 50;
      ctx.shadowColor = 'white';
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(width - 200, 150, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Stars
      for (let i = 0; i < stars.length; i++) {
        /** @type {number} */
        const starAlpha = Math.abs(Math.sin(Date.now() * stars[i].blinkSpeed + stars[i].alpha));
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, stars[i].size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Generate and Draw Meteors
      if (Math.random() < 0.01) {
        meteors.push({
          x: width + 50,
          y: Math.random() * (height * 0.5),
          speed: 400 + Math.random() * 300,
          length: 40 + Math.random() * 60,
        });
      }

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].x -= meteors[i].speed * dt;
        meteors[i].y += meteors[i].speed * 0.5 * dt;

        ctx.beginPath();
        ctx.moveTo(meteors[i].x, meteors[i].y);
        ctx.lineTo(meteors[i].x + meteors[i].length, meteors[i].y - meteors[i].length * 0.5);
        ctx.stroke();

        if (meteors[i].x < -100 || meteors[i].y > height + 100) {
          meteors.splice(i, 1);
        }
      }
    }

    // Draw Clouds
    for (let i = 0; i < clouds.length; i++) {
      clouds[i].x -= clouds[i].speed * dt;
      if (clouds[i].x < -150 * clouds[i].scale) {
        clouds[i].x = width + 50;
        clouds[i].y = Math.random() * (height * 0.6);
      }

      ctx.fillStyle = isNightMode
        ? `rgba(43, 62, 92, ${clouds[i].opacity * 0.5})`
        : `rgba(255, 255, 255, ${clouds[i].opacity})`;

      drawCloudShape(clouds[i].x, clouds[i].y, clouds[i].scale);
    }
  };

  /**
   * @param {number} time
   */
  const animate = (time) => {
    /** @type {number} */
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    render(dt);
    requestAnimationFrame(animate);
  };

  const handleResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };

  window.addEventListener('resize', handleResize);
  handleResize();
  requestAnimationFrame(animate);

  return {
    /**
     * @param {boolean} mode
     */
    setMode: (mode) => {
      isNightMode = mode;
    },
  };
};

/** @type {HTMLCanvasElement | null} */
const canvasElement = document.getElementById('sky-canvas');

/** @type {ReturnType<typeof initSkyCanvas> | null} */
export const skyController = initSkyCanvas(canvasElement);
