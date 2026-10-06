'use client';

import { motion, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { JourneyPoint } from '@/data/journey.data';
import { AnimatedButton } from '@/components/animations/AnimatedButton';

/* ============================================================
   WAVE IMAGE

   waveStart / waveEnd control which vertical area moves.

   0.0 = top
   0.5 = middle
   1.0 = bottom
============================================================ */

type WaveImageProps = {
  src: string;
  alt: string;

  width?: string;
  height?: string;

  amplitude?: number;
  speed?: number;
  frequency?: number;

  waveStart?: number;
  waveEnd?: number;

  trigger?: MotionValue<number>;

  oneShotDuration?: number;
};

function WaveImage({ src, alt, width, height, amplitude = 0.055, speed = 5.05, frequency = 2, waveStart = 0, waveEnd = 0.5, trigger, oneShotDuration = 4 }: WaveImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });

    if (!gl) {
      console.warn('WebGL is not supported.');
      return;
    }

    let destroyed = false;
    let animationFrame = 0;
    let imageReady = false;

    /* ==========================================================
       ONE-SHOT WAVE STATE
    ========================================================== */

    let waveStartedAt = -1;

    let previousTrigger = trigger?.get() ?? 0;

    const startOneShotWave = () => {
      waveStartedAt = performance.now();
    };

    /* ==========================================================
       IMAGE
    ========================================================== */

    const image = new Image();

    image.decoding = 'async';
    image.crossOrigin = 'anonymous';
    image.src = src;

    /* ==========================================================
       VERTEX SHADER
    ========================================================== */

    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_uv;

      uniform float u_time;
      uniform float u_amplitude;
      uniform float u_frequency;

      uniform float u_waveStart;
      uniform float u_waveEnd;

      uniform vec2 u_renderScale;

      varying vec2 v_uv;

      void main() {

        vec2 position = a_position * u_renderScale;

        float x = a_position.x;
        float y = a_position.y;

        float xProgress =
          (x + 1.0) * 0.5;

        float yProgress =
          (1.0 - y) * 0.5;

        float waveMask =
          smoothstep(
            u_waveStart,
            u_waveEnd,
            yProgress
          );

        float mainWave =
          sin(
            yProgress *
            u_frequency *
            6.2831853
            -
            u_time
          );

        float largeFold =
          sin(
            yProgress *
            3.14159265
            -
            u_time * 0.72
            +
            xProgress * 2.0
          );

        float secondaryWave =
          sin(
            yProgress *
            u_frequency *
            3.15
            -
            u_time * 0.62
            +
            xProgress * 3.0
          ) * 0.30;

        float crossWave =
          sin(
            xProgress *
            3.14159265
            +
            yProgress *
            4.0
            -
            u_time * 0.48
          ) * 0.18;

        float wave =
          mainWave +
          largeFold * 0.48 +
          secondaryWave +
          crossWave;

        float edgeDistance =
          min(
            min(
              xProgress,
              1.0 - xProgress
            ),
            min(
              yProgress,
              1.0 - yProgress
            )
          );

        float surfaceStrength =
          0.72 +
          edgeDistance * 0.55;

        position.y +=
          wave *
          u_amplitude *
          surfaceStrength *
          waveMask;

        float horizontalWave =
          sin(
            yProgress *
            u_frequency *
            5.2
            -
            u_time * 0.82
            +
            xProgress * 2.4
          );

        position.x +=
          horizontalWave *
          u_amplitude *
          0.32 *
          surfaceStrength *
          waveMask;

        float globalBend =
          sin(
            yProgress *
            3.14159265
            -
            u_time * 0.42
          );

        position.x +=
          globalBend *
          u_amplitude *
          0.16 *
          waveMask;

        v_uv = a_uv;

        gl_Position = vec4(
          position,
          0.0,
          1.0
        );
      }
    `;

    /* ==========================================================
       FRAGMENT SHADER
    ========================================================== */

    const fragmentShaderSource = `
      precision mediump float;

      uniform sampler2D u_texture;

      varying vec2 v_uv;

      void main() {

        vec4 color =
          texture2D(
            u_texture,
            v_uv
          );

        gl_FragColor = color;
      }
    `;

    /* ==========================================================
       SHADER CREATOR
    ========================================================== */

    const createShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);

      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));

        gl.deleteShader(shader);

        return null;
      }

      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);

    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      return;
    }

    /* ==========================================================
       PROGRAM
    ========================================================== */

    const program = gl.createProgram();

    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    /* ==========================================================
       HIGH DENSITY MESH
    ========================================================== */

    const columns = 100;
    const rows = 100;

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let row = 0; row <= rows; row++) {
      const v = row / rows;

      const y = 1 - v * 2;

      for (let column = 0; column <= columns; column++) {
        const u = column / columns;

        const x = u * 2 - 1;

        positions.push(x, y);
        uvs.push(u, 1 - v);
      }
    }

    /* ==========================================================
       TRIANGLES
    ========================================================== */

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const current = row * (columns + 1) + column;

        const next = current + 1;

        const below = current + columns + 1;

        const belowNext = below + 1;

        indices.push(
          current,
          below,
          next,

          next,
          below,
          belowNext
        );
      }
    }

    /* ==========================================================
       POSITION BUFFER
    ========================================================== */

    const positionBuffer = gl.createBuffer();

    if (!positionBuffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');

    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    /* ==========================================================
       UV BUFFER
    ========================================================== */

    const uvBuffer = gl.createBuffer();

    if (!uvBuffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    const uvLocation = gl.getAttribLocation(program, 'a_uv');

    gl.enableVertexAttribArray(uvLocation);

    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

    /* ==========================================================
       INDEX BUFFER
    ========================================================== */

    const indexBuffer = gl.createBuffer();

    if (!indexBuffer) return;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    /* ==========================================================
       UNIFORMS
    ========================================================== */

    const timeLocation = gl.getUniformLocation(program, 'u_time');

    const amplitudeLocation = gl.getUniformLocation(program, 'u_amplitude');

    const frequencyLocation = gl.getUniformLocation(program, 'u_frequency');

    const waveStartLocation = gl.getUniformLocation(program, 'u_waveStart');

    const waveEndLocation = gl.getUniformLocation(program, 'u_waveEnd');

    const renderScaleLocation = gl.getUniformLocation(program, 'u_renderScale');

    const textureLocation = gl.getUniformLocation(program, 'u_texture');

    /* ==========================================================
       TEXTURE
    ========================================================== */

    const texture = gl.createTexture();

    if (!texture) return;

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

    /* ==========================================================
       RESIZE
    ========================================================== */

    const WAVE_PADDING = 70;

    const resize = () => {
      const containerWidth = container.clientWidth;

      if (!containerWidth || !image.naturalWidth || !image.naturalHeight) {
        return;
      }

      const aspectRatio = image.naturalHeight / image.naturalWidth;

      const imageHeight = containerWidth * aspectRatio;

      const renderWidth = containerWidth + WAVE_PADDING * 2;

      const renderHeight = imageHeight + WAVE_PADDING * 2;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(renderWidth * dpr);

      canvas.height = Math.round(renderHeight * dpr);

      canvas.style.width = `${renderWidth}px`;

      canvas.style.height = `${renderHeight}px`;

      canvas.style.left = `${-WAVE_PADDING}px`;

      canvas.style.top = `${-WAVE_PADDING}px`;

      container.style.height = `${imageHeight}px`;

      const scaleX = containerWidth / renderWidth;

      const scaleY = imageHeight / renderHeight;

      gl.viewport(0, 0, canvas.width, canvas.height);

      if (renderScaleLocation) {
        gl.useProgram(program);

        gl.uniform2f(renderScaleLocation, scaleX, scaleY);
      }
    };

    /* ==========================================================
       IMAGE LOAD
    ========================================================== */

    image.onload = () => {
      if (destroyed) return;

      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      imageReady = true;

      resize();
    };

    image.onerror = () => {
      console.error(`Failed to load image: ${src}`);
    };

    resize();

    /* ==========================================================
       RESIZE OBSERVER
    ========================================================== */

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(container);

    /* ==========================================================
       INITIAL TRIGGER
    ========================================================== */

    if (previousTrigger >= 1) {
      startOneShotWave();
    }

    /* ==========================================================
       TRIGGER LISTENER
    ========================================================== */

    const unsubscribeTrigger = trigger?.on('change', (value) => {
      if (value >= 1 && previousTrigger < 1) {
        startOneShotWave();
      }

      previousTrigger = value;
    });

    /* ==========================================================
       ANIMATION
    ========================================================== */

    const render = (currentTime: number) => {
      if (destroyed) return;

      animationFrame = requestAnimationFrame(render);

      if (!imageReady) return;

      if (waveStartedAt < 0) return;

      const waveElapsed = (currentTime - waveStartedAt) / 1000;

      /* ========================================================
         WAVE FINISHED
      ======================================================== */

      if (waveElapsed >= oneShotDuration) {
        gl.useProgram(program);

        gl.uniform1f(timeLocation, oneShotDuration * speed);

        gl.uniform1f(amplitudeLocation, 0);

        gl.uniform1f(frequencyLocation, frequency);

        gl.uniform1f(waveStartLocation, waveStart);

        gl.uniform1f(waveEndLocation, waveEnd);

        gl.activeTexture(gl.TEXTURE0);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.uniform1i(textureLocation, 0);

        gl.clearColor(0, 0, 0, 0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        waveStartedAt = -1;

        return;
      }

      /* ========================================================
         ATTACK
      ======================================================== */

      const attackDuration = 0.28;

      const attackProgress = Math.min(waveElapsed / attackDuration, 1);

      const attack = 1 - Math.pow(1 - attackProgress, 3);

      /* ========================================================
         DECAY
      ======================================================== */

      const decayStart = oneShotDuration * 0.52;

      const decayProgress = waveElapsed <= decayStart ? 0 : Math.min((waveElapsed - decayStart) / Math.max(0.01, oneShotDuration - decayStart), 1);

      const smoothDecay = 1 - Math.pow(decayProgress, 2.8);

      const envelope = Math.max(0, Math.min(1, attack * smoothDecay));

      /* ========================================================
         WEBGL
      ======================================================== */

      gl.useProgram(program);

      gl.uniform1f(timeLocation, waveElapsed * speed);

      gl.uniform1f(amplitudeLocation, amplitude * envelope);

      gl.uniform1f(frequencyLocation, frequency);

      gl.uniform1f(waveStartLocation, waveStart);

      gl.uniform1f(waveEndLocation, waveEnd);

      /* ========================================================
         TEXTURE
      ======================================================== */

      gl.activeTexture(gl.TEXTURE0);

      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.uniform1i(textureLocation, 0);

      /* ========================================================
         DRAW
      ======================================================== */

      gl.clearColor(0, 0, 0, 0);

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    };

    animationFrame = requestAnimationFrame(render);

    /* ==========================================================
       CLEANUP
    ========================================================== */

    return () => {
      destroyed = true;

      cancelAnimationFrame(animationFrame);

      unsubscribeTrigger?.();

      resizeObserver.disconnect();

      gl.deleteTexture(texture);

      gl.deleteBuffer(positionBuffer);

      gl.deleteBuffer(uvBuffer);

      gl.deleteBuffer(indexBuffer);

      gl.deleteProgram(program);

      gl.deleteShader(vertexShader);

      gl.deleteShader(fragmentShader);
    };
  }, [src, amplitude, speed, frequency, waveStart, waveEnd, trigger, oneShotDuration]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-visible"
      style={{
        width: width ?? '100%',
        height,
      }}
      role="img"
      aria-label={alt}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute block max-w-none" />
    </div>
  );
}

/* ============================================================
   JOURNEY CARD
============================================================ */

type JourneyCardProps = {
  project: JourneyPoint;
  revealProgress: number;
  journeyProgress: MotionValue<number>;
};

/* ============================================================
   MOBILE POSITIONS

   These MUST stay in sync with WireJourney.tsx
============================================================ */

const MOBILE_CARD_TOP_OFFSET = 42;

const MOBILE_PROJECT_Y = [
  8 + MOBILE_CARD_TOP_OFFSET,
  82 + MOBILE_CARD_TOP_OFFSET,
  156 + MOBILE_CARD_TOP_OFFSET,
  230 + MOBILE_CARD_TOP_OFFSET,
  304 + MOBILE_CARD_TOP_OFFSET,
  378 + MOBILE_CARD_TOP_OFFSET,
  452 + MOBILE_CARD_TOP_OFFSET,
  526 + MOBILE_CARD_TOP_OFFSET,
];

const MOBILE_CONTACT_Y = 610 + MOBILE_CARD_TOP_OFFSET;

/* ============================================================
   RESPONSIVE WIDTH HELPERS
============================================================ */

/**
 * Resolves a clamp() width such as:
 *
 * clamp(560px, 46vw, 900px)
 *
 * into an actual pixel width for the current viewport.
 */
function resolveCardWidth(widthValue: string, viewportWidth: number) {
  const clampMatch = widthValue.match(/clamp\(\s*([\d.]+)px\s*,\s*([\d.]+)vw\s*,\s*([\d.]+)px\s*\)/i);

  if (clampMatch) {
    const minWidth = Number(clampMatch[1]);

    const viewportRatio = Number(clampMatch[2]) / 100;

    const maxWidth = Number(clampMatch[3]);

    const preferredWidth = viewportWidth * viewportRatio;

    return Math.min(Math.max(minWidth, preferredWidth), maxWidth);
  }

  const pxMatch = widthValue.match(/([\d.]+)px/i);

  if (pxMatch) {
    return Number(pxMatch[1]);
  }

  /*
   * Safe fallback.
   */
  return Math.min(viewportWidth * 0.7, 700);
}

/**
 * Keeps the entire card inside the viewport.
 *
 * project.x remains the preferred center position.
 *
 * If the card would crop on either side,
 * its center automatically moves inward.
 */
function getSafeCardPosition(xPercent: number, cardWidth: number, viewportWidth: number) {
  const horizontalPadding = 24;

  const usableWidth = Math.max(0, viewportWidth - horizontalPadding * 2);

  const safeWidth = Math.min(cardWidth, usableWidth);

  const halfWidthPercent = (safeWidth / viewportWidth) * 50;

  const minimumX = halfWidthPercent + (horizontalPadding / viewportWidth) * 100;

  const maximumX = 100 - halfWidthPercent - (horizontalPadding / viewportWidth) * 100;

  return Math.min(maximumX, Math.max(minimumX, xPercent));
}

/* ============================================================
   JOURNEY CARD
============================================================ */

export function JourneyCard({ project, revealProgress, journeyProgress }: JourneyCardProps) {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);

  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  /* ==========================================================
     RESPONSIVE DETECTION
  ========================================================== */

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewport();

    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  /* ==========================================================
     VISIBILITY
  ========================================================== */

  const visible = useTransform(journeyProgress, (progress) => (progress >= revealProgress ? 1 : 0));

  const scale = useTransform(journeyProgress, (progress) => (progress >= revealProgress ? 1 : 0.985));

  /* ==========================================================
     MOBILE POSITION
  ========================================================== */

  const getMobileY = () => {
    if (project.type === 'contact') {
      return MOBILE_CONTACT_Y;
    }

    const projectIndex = [50, 145, 255, 395, 485, 590, 665, 755].indexOf(project.y);

    if (projectIndex === -1) {
      return 8;
    }

    return MOBILE_PROJECT_Y[projectIndex] ?? 8;
  };

  const mobileY = getMobileY();

  /* ==========================================================
     CONTACT
  ========================================================== */

  if (project.type === 'contact') {
    return (
      <motion.div
        style={{
          left: isMobile ? '50%' : `${project.x}%`,

          top: isMobile ? `${mobileY}vh` : `${project.y}vh`,

          x: '-50%',

          opacity: visible,

          scale,

          zIndex: 99999,

          width: isMobile ? 'calc(100vw - 40px)' : `min(900px, calc(100vw - 48px))`,
        }}
        className="pointer-events-auto absolute text-center"
      >
        <AnimatedButton
          variant="animated"
          href="mailto:info@ashenox.com"
          borderColor="rgba(255, 255, 255, 0.8)"
          icon="right"
          charShift={78}
          charStagger={0.025}
          charDuration={0.75}
          widthClassName="w-[150px] sm:w-[150px] md:w-[150px] lg:w-[150px]"
          className="tems-center mx-auto flex justify-between font-mono uppercase tracking-[-0.01em]"
        >
          Contact Us
        </AnimatedButton>

        <p className="mx-auto mt-8 w-full text-[clamp(1.5rem,2vw,1.8rem)] font-light leading-[1.05] tracking-[-0.045em] text-white/80">
          Over the years, we have delivered successful projects for clients worldwide,
          <br className="hidden md:block" />
          and if you would like to explore work related to your requirements, we
          <br className="hidden md:block" />
          would be happy to share relevant examples.
        </p>
      </motion.div>
    );
  }

  /* ==========================================================
     PROJECT RESPONSIVE LAYOUT
  ========================================================== */

  const originalWidth = project.width ?? 'clamp(320px, 42vw, 700px)';

  /*
   * Mobile:
   * Full width minus 40px.
   *
   * Tablet/Desktop/XL:
   * Resolve the data width to actual pixels.
   */
  const resolvedWidth = resolveCardWidth(originalWidth, viewportWidth);

  /*
   * Never allow the actual card width
   * to exceed the viewport.
   */
  const maxAllowedWidth = Math.max(0, viewportWidth - 48);

  const safeWidth = Math.min(resolvedWidth, maxAllowedWidth);

  /*
   * Keep the original project.x
   * whenever possible.
   *
   * If the card would crop,
   * move its center inward automatically.
   */
  const safeX = getSafeCardPosition(project.x, safeWidth, viewportWidth);

  /* ==========================================================
     PROJECT
  ========================================================== */

  return (
    <motion.div
      style={{
        /*
         * ================================================
         * HORIZONTAL POSITION
         * ================================================
         *
         * Mobile:
         * Always centered.
         *
         * Tablet/Desktop/XL:
         * Use original x, but automatically
         * move inward if the card would crop.
         */
        left: isMobile ? '50%' : `${safeX}%`,

        /*
         * ================================================
         * VERTICAL POSITION
         * ================================================
         */
        top: isMobile ? `${mobileY}vh` : `${project.y}vh`,

        x: '-50%',

        opacity: visible,

        scale,

        zIndex: 99999,

        /*
         * ================================================
         * WIDTH
         * ================================================
         *
         * Mobile:
         * 20px gap on both sides.
         *
         * Other devices:
         * Automatically calculated from the
         * project's clamp() width.
         *
         * It can never exceed the viewport.
         */
        width: isMobile ? 'calc(100vw - 40px)' : `${safeWidth}px`,
      }}
      className="pointer-events-auto absolute"
    >
      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="relative w-full overflow-visible">
        <WaveImage src={project.image} alt={project.title} amplitude={0.035} speed={2.2} frequency={1.4} waveStart={0} waveEnd={0.7} trigger={visible} oneShotDuration={5} width="100%" />
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="mt-3 flex w-full flex-col gap-4 md:mt-2 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h3 className="m-0 text-[clamp(1.25rem,2.5vw,1.8rem)] font-light tracking-[-0.05em] text-white/80">{project.title}</h3>

          <p className="mt-1.5 max-w-[280px] text-[11px] leading-[1.2] tracking-[-0.05em] text-white/45 md:text-[16px]">{project.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-12 pb-1.5 text-[14px] uppercase tracking-[-0.02em] text-white/80 [word-spacing:5px]">
          <AnimatedButton
            variant="animated"
            // href={`/portfolio/${project.slug}`}
            href="#"
            borderColor="rgba(255, 255, 255, 0.8)"
            icon="right"
            charShift={37}
            charStagger={0.025}
            charDuration={0.75}
            widthClassName="w-[150px]"
            className="group relative flex items-center justify-between font-mono uppercase"
          >
            Explore Project
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  );
}
