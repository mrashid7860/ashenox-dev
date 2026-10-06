'use client';

import { motion, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { JourneyPoint } from '@/data/journey.data';

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

  amplitude?: number;
  speed?: number;
  frequency?: number;

  /* Animated vertical area */
  waveStart?: number;
  waveEnd?: number;
};

function WaveImage({ src, alt, amplitude = 0.055, speed = 5.05, frequency = 2, waveStart = 0, waveEnd = 0.5 }: WaveImageProps) {
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

      /* Extra transparent space around the card so the 3D deformation
         can travel outside the original box without being clipped. */
      uniform vec2 u_renderScale;

      varying vec2 v_uv;

      void main() {

        /* Keep the undistorted image at its original size while the
           WebGL canvas itself has extra breathing room around it. */
        vec2 position = a_position * u_renderScale;

        float x = a_position.x;
        float y = a_position.y;

        /*
         * ========================================================
         * PROGRESS
         * ========================================================
         *
         * xProgress:
         * left  = 0
         * right = 1
         *
         * yProgress:
         * top    = 0
         * bottom = 1
         */

        float xProgress =
          (x + 1.0) * 0.5;

        float yProgress =
          (1.0 - y) * 0.5;


        /*
         * ========================================================
         * WAVE AREA MASK
         * ========================================================
         *
         * Only the selected vertical area moves.
         *
         * 0.0 = top
         * 1.0 = bottom
         *
         * smoothstep creates a soft transition.
         */

        float waveMask =
          smoothstep(
            u_waveStart,
            u_waveEnd,
            yProgress
          );


        /*
         * ========================================================
         * MAIN WAVE
         * ========================================================
         */

        float mainWave =
          sin(
            yProgress *
            u_frequency *
            6.2831853
            -
            u_time
          );


        /*
         * ========================================================
         * LARGE WAVE
         * ========================================================
         */

        float largeFold =
          sin(
            yProgress *
            3.14159265
            -
            u_time * 0.72
            +
            xProgress * 2.0
          );


        /*
         * ========================================================
         * SECONDARY WAVE
         * ========================================================
         */

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


        /*
         * ========================================================
         * CROSS RIPPLE
         * ========================================================
         */

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


        /*
         * ========================================================
         * COMBINE WAVES
         * ========================================================
         */

        float wave =
          mainWave +
          largeFold * 0.48 +
          secondaryWave +
          crossWave;


        /*
         * ========================================================
         * SURFACE STRENGTH
         * ========================================================
         */

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


        /*
         * ========================================================
         * VERTICAL MOVEMENT
         * ========================================================
         */

        position.y +=
          wave *
          u_amplitude *
          surfaceStrength *
          waveMask;


        /*
         * ========================================================
         * HORIZONTAL RIPPLE
         * ========================================================
         */

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


        /*
         * ========================================================
         * GLOBAL BEND
         * ========================================================
         */

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


        /*
         * ========================================================
         * TEXTURE
         * ========================================================
         */

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

    /*
     * The canvas used to be exactly the same size as the image.
     * Because the shader moves vertices outside that rectangle, WebGL
     * clipped the deformed edges.
     *
     * Give the canvas transparent breathing room around the image.
     * The image remains the same visual size while the wave can move
     * into this extra space.
     */
    const WAVE_PADDING = 70;

    const resize = () => {
      const width = container.clientWidth;

      if (!width || !image.naturalWidth || !image.naturalHeight) {
        return;
      }

      const aspectRatio = image.naturalHeight / image.naturalWidth;
      const height = width * aspectRatio;

      const renderWidth = width + WAVE_PADDING * 2;
      const renderHeight = height + WAVE_PADDING * 2;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(renderWidth * dpr);
      canvas.height = Math.round(renderHeight * dpr);

      canvas.style.width = `${renderWidth}px`;
      canvas.style.height = `${renderHeight}px`;
      canvas.style.left = `${-WAVE_PADDING}px`;
      canvas.style.top = `${-WAVE_PADDING}px`;

      /*
       * Keep the original image at exactly the same size inside
       * the larger WebGL canvas.
       */
      const scaleX = width / renderWidth;
      const scaleY = height / renderHeight;

      gl.viewport(0, 0, canvas.width, canvas.height);

      if (renderScaleLocation) {
        gl.useProgram(program);
        gl.uniform2f(renderScaleLocation, scaleX, scaleY);
      }

      /* Parent keeps the original image height. */
      container.style.height = `${height}px`;
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
       ANIMATION
    ========================================================== */

    const startTime = performance.now();

    const render = (currentTime: number) => {
      if (destroyed) return;

      const elapsed = (currentTime - startTime) / 1000;

      gl.clearColor(0, 0, 0, 0);

      gl.clear(gl.COLOR_BUFFER_BIT);

      if (imageReady) {
        gl.useProgram(program);

        gl.uniform1f(timeLocation, elapsed * speed);

        gl.uniform1f(amplitudeLocation, amplitude);

        gl.uniform1f(frequencyLocation, frequency);

        gl.uniform1f(waveStartLocation, waveStart);

        gl.uniform1f(waveEndLocation, waveEnd);

        gl.activeTexture(gl.TEXTURE0);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.uniform1i(textureLocation, 0);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      }

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    /* ==========================================================
       CLEANUP
    ========================================================== */

    return () => {
      destroyed = true;

      cancelAnimationFrame(animationFrame);

      resizeObserver.disconnect();

      gl.deleteTexture(texture);

      gl.deleteBuffer(positionBuffer);

      gl.deleteBuffer(uvBuffer);

      gl.deleteBuffer(indexBuffer);

      gl.deleteProgram(program);

      gl.deleteShader(vertexShader);

      gl.deleteShader(fragmentShader);
    };
  }, [src, amplitude, speed, frequency, waveStart, waveEnd]);

  return (
    <div ref={containerRef} className="relative w-full overflow-visible rounded-[8px]" role="img" aria-label={alt}>
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
  journeyProgress: any;
};

export function JourneyCardCopy({ project, revealProgress, journeyProgress }: JourneyCardProps) {
  const visible = useTransform(journeyProgress, (progress) => (progress >= revealProgress ? 1 : 0));

  const scale = useTransform(journeyProgress, (progress) => (progress >= revealProgress ? 1 : 0.985));

  /* ==========================================================
     CONTACT
  ========================================================== */

  if (project.type === 'contact') {
    return (
      <motion.div
        style={{
          left: `${project.x}%`,
          top: `${project.y}vh`,
          x: '-50%',
          opacity: visible,
          scale,
          zIndex: 99999,
        }}
        className="pointer-events-auto absolute w-[min(90vw,900px)] text-center"
      >
        <a
          href="#contact"
          className="mx-auto flex w-[190px] items-center justify-between border-b border-white/50 pb-1 text-[12px] uppercase tracking-[-0.01em] text-white/80 transition-opacity duration-300 hover:opacity-60 md:w-[150px] md:text-[13px]"
        >
          <span>Contact Us</span>
          <span>→</span>
        </a>

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
     PROJECT
  ========================================================== */

  return (
    <motion.div
      style={{
        left: `${project.x}%`,
        top: `${project.y}vh`,
        x: '-50%',
        opacity: visible,
        scale,
        zIndex: 99999,
      }}
      className="pointer-events-auto absolute w-[min(75vw,620px)]"
    >
      {/* ======================================================
          IMAGE
      ====================================================== */}

      <WaveImage src={project.image} alt={project.title} amplitude={0.035} speed={2.2} frequency={1.4} waveStart={0.0} waveEnd={0.7} />

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="mt-3 flex flex-col gap-4 md:mt-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="m-0 text-[clamp(1.4rem,2.5vw,1.8rem)] font-light tracking-[-0.05em] text-white/80">{project.title}</h3>

          <p className="mt-1.5 max-w-[280px] text-[11px] leading-[1.2] tracking-[-0.05em] text-white/45 md:text-[16px]">{project.description}</p>
        </div>

        <div className="flex items-center gap-12 border-b border-white/65 pb-1.5 text-[14px] uppercase tracking-[-0.02em] text-white/80 [word-spacing:5px]">
          <span>Explore Project</span>
          <span>→</span>
        </div>
      </div>
    </motion.div>
  );
}
