/**
 * @fileoverview SkyCanvas.
 * @author Yasmin Seidel (JasminDreasond)
 * @contributor Gemini (AI Assistant by Google)
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {{setMode: function(boolean): void}}
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

  /**
   * @returns {{x: number, y: number, size: number, blinkSpeed: number, alpha: number, isBig: boolean}}
   */
  const createStar = (isBig = false) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: isBig ? 2 + Math.random() * 2 : Math.random() * 2,
    blinkSpeed: isBig ? 0.0005 + Math.random() * 0.001 : 0.001 + Math.random() * 0.002,
    alpha: Math.random(),
    isBig,
  });

  /**
   * @returns {{moonPhase: number, hasGalaxy: boolean, hasBigStars: boolean, meteorRate: number}}
   */
  const getNightlyData = () => {
    /** @type {string} */
    const today = new Date().toDateString();
    /** @type {string | null} */
    const cachedData = localStorage.getItem('skyCanvasNightData');

    if (cachedData) {
      /** @type {{date: string, data: {moonPhase: number, hasGalaxy: boolean, hasBigStars: boolean, meteorRate: number}}} */
      const parsed = JSON.parse(cachedData);
      if (parsed.date === today) {
        return parsed.data;
      }
    }

    /** @type {number} */
    const randomMeteor = Math.random();

    /** @type {{moonPhase: number, hasGalaxy: boolean, hasBigStars: boolean, meteorRate: number}} */
    const newData = {
      moonPhase: Math.random() * 120 - 60, // Offset for the shadow (-60 to 60)
      hasGalaxy: Math.random() > 0.6,
      hasBigStars: Math.random() > 0.7,
      meteorRate: randomMeteor < 0.7 ? 0.01 : randomMeteor < 0.85 ? 0.05 : 0.002, // 70% normal, 15% high, 15% low
    };

    localStorage.setItem('skyCanvasNightData', JSON.stringify({ date: today, data: newData }));
    return newData;
  };

  /** @type {ReturnType<typeof getNightlyData>} */
  const nightData = getNightlyData();

  /** @type {Array<ReturnType<typeof createStar>>} */
  let stars = Array.from({ length: 400 }, () => createStar(false));

  if (nightData.hasBigStars) {
    /** @type {Array<ReturnType<typeof createStar>>} */
    const bigStars = Array.from({ length: 15 }, () => createStar(true));
    stars = stars.concat(bigStars);
  }

  /** @type {Array<{x: number, y: number, speed: number, length: number}>} */
  let meteors = [];

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

  /** @type {HTMLCanvasElement} */
  const moonCanvas = document.createElement('canvas');
  moonCanvas.width = 140;
  moonCanvas.height = 140;

  /**
   * @param {number} phaseOffset
   */
  const preRenderMoon = (phaseOffset) => {
    /** @type {CanvasRenderingContext2D} */
    const mCtx = moonCanvas.getContext('2d');
    /** @type {number} */
    const center = 70;
    /** @type {number} */
    const radius = 60;

    mCtx.clearRect(0, 0, 140, 140);

    // Base Moon
    mCtx.fillStyle = '#ffffff';
    mCtx.beginPath();
    mCtx.arc(center, center, radius, 0, Math.PI * 2);
    mCtx.fill();

    // Moon Phase Shadow (Cuts out the base moon)
    mCtx.globalCompositeOperation = 'destination-out';
    mCtx.beginPath();
    mCtx.arc(center + phaseOffset, center, radius, 0, Math.PI * 2);
    mCtx.fill();
    mCtx.globalCompositeOperation = 'source-over'; // Reset
  };

  preRenderMoon(nightData.moonPhase);

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
      if (nightData.hasGalaxy) {
        ctx.save();
        ctx.translate(width * 0.5, height * 0.3);
        ctx.rotate(-Math.PI * 0.15);
        /** @type {CanvasGradient} */
        const galaxyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.8);
        galaxyGrad.addColorStop(0, 'rgba(40, 20, 80, 0.3)');
        galaxyGrad.addColorStop(0.5, 'rgba(20, 10, 50, 0.1)');
        galaxyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.scale(1, 0.3);
        ctx.fillStyle = galaxyGrad;
        ctx.fillRect(-width, -height, width * 2, height * 2);
        ctx.restore();
      }

      // Draw Moon
      ctx.shadowBlur = 50;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.drawImage(moonCanvas, width - 200 - 70, 150 - 70);
      ctx.shadowBlur = 0;

      // Draw Stars
      for (let i = 0; i < stars.length; i++) {
        /** @type {number} */
        const starAlpha = Math.abs(Math.sin(Date.now() * stars[i].blinkSpeed + stars[i].alpha));
        ctx.fillStyle = stars[i].isBig
          ? `rgba(200, 220, 255, ${starAlpha})`
          : `rgba(255, 255, 255, ${starAlpha})`;

        if (stars[i].isBig) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'white';
        }

        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, stars[i].size, 0, Math.PI * 2);
        ctx.fill();

        if (stars[i].isBig) ctx.shadowBlur = 0;
      }

      // Generate and Draw Meteors
      if (Math.random() < nightData.meteorRate) {
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
    /** @type {number} */
    const oldWidth = width;
    /** @type {number} */
    const oldHeight = height;

    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Redistribute stars to avoid "holes" after resize
    stars = stars.map((star) => ({
      ...star,
      x: (star.x / oldWidth) * width,
      y: (star.y / oldHeight) * height,
    }));

    // Clear meteors that are now out of bounds
    meteors = meteors.filter((m) => m.x <= width + 100 && m.y <= height + 100);
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
export const skyController = canvasElement ? initSkyCanvas(canvasElement) : null;
