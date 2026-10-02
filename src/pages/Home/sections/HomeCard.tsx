'use client';

import { motion, MotionValue, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import work01 from '@/assets/img/orbit-01.jpg';
import work02 from '@/assets/img/orbit-02.jpg';
import work03 from '@/assets/img/orbit-03.jpg';
import work04 from '@/assets/img/orbit-04.jpg';
import work05 from '@/assets/img/orbit-05.jpg';
import work06 from '@/assets/img/orbit-06.jpg';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';
import { usePageTransition } from '@/components/common/PageLoader';
// ============================================================
// TYPES
// ============================================================

type Breakpoint = 'desktop' | 'tablet' | 'mobile';

type FixedPreset = 'none' | 'top-left' | 'top' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right' | 'custom';

type Direction = 'custom' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type EaseName = 'linear' | 'sineInOut' | 'quadOut' | 'cubicOut' | 'quartOut' | 'expoOut' | 'backOut';

type WaveParams = {
  fixed: FixedPreset;
  angle: number;
  fixedSize: number;
  softness: number;
  waves: number;
  reverse: boolean;
  bend: number;
  stretch: number;
  ripple: number;
  amplitude: number;
  speed: number;
  phase: number;
  fadeInEnd: number;
  fadeOutStart: number;
};

type Timing = { start: number; duration: number; ease: EaseName };

type FromConfig = {
  direction?: Direction; // 'custom' (or omitted) = use x / y. Otherwise the card comes from that side.
  distance?: number; // used with a direction preset: 1 = fully off-screen, bigger = further away
  x: number; // custom start, in vw (relative to the card's slot)
  y: number; // custom start, in vh
  rotate: number;
  scale: number;
};

type CardBase = {
  column: number;
  row: number;
  offset: { x: number; y: number };
  from: FromConfig;
  timing: Timing;
  wave: WaveParams;
};

// only the fields you list are overridden, everything else is inherited from desktop
type CardOverride = {
  column?: number;
  row?: number;
  offset?: { x: number; y: number };
  from?: Partial<FromConfig>;
  timing?: Partial<Timing>;
  wave?: Partial<WaveParams>;
};

type CardData = CardBase & {
  id: number;
  alt: string;
  tablet?: CardOverride;
  mobile?: CardOverride;
};

type ResolvedCard = CardBase & { id: number; alt: string; image: any };

type LayoutConfig = {
  cols: number;
  rows: number;
  sectionVh: number; // scroll length
  scrollEnd: number;
  cardWidthVw: number;
  minW: number;
  maxW: number;
  gapX: number;
  gapY: number;
  aspect: number;
  radius: number;
};

// ============================================================
// >>> CONTROL CENTER <
// ============================================================

const BREAKPOINTS = { mobile: 768, tablet: 1100 }; // < 768 mobile, < 1100 tablet, else desktop

const GLOBAL = {
  spring: { stiffness: 120, damping: 30, mass: 0.5 },
  waveAmplitude: 0.15,
  background: 'bg-[linear-gradient(180deg,#D2D2D2_0%,#FFFFFF_100%)]',
};

// layout per screen size (tablet = desktop grid, bigger cards; mobile = 2 per row)
const LAYOUTS: Record<Breakpoint, LayoutConfig> = {
  desktop: { cols: 3, rows: 2, sectionVh: 380, scrollEnd: 1, cardWidthVw: 19, minW: 96, maxW: 380, gapX: 14, gapY: 25, aspect: 0.72, radius: 9 },
  tablet: { cols: 3, rows: 2, sectionVh: 180, scrollEnd: 1, cardWidthVw: 28, minW: 150, maxW: 340, gapX: 14, gapY: 22, aspect: 0.72, radius: 10 },
  mobile: { cols: 2, rows: 3, sectionVh: 300, scrollEnd: 1, cardWidthVw: 42, minW: 120, maxW: 260, gapX: 10, gapY: 18, aspect: 0.72, radius: 8 },
};

// intro texts per screen size
const INTRO = {
  start: 0, // 0 = section top reaches the screen center, 1 = section ends
  end: 1,
  color: '#444',
  subtitle: 'Exploring ideas through daily design practice.',
  bp: {
    desktop: {
      fontVw: 7.7,
      left: { text: 'MOTION', y: 60, from: -26, to: 105 }, // y = % of screen height, from/to = vw
      right: { text: 'DESIGN', y: 40, from: 23, to: -105 },
      subSize: 13,
      subWidth: 180,
    },
    tablet: {
      fontVw: 9,
      left: { text: 'MOTION', y: 60, from: -50, to: 110 },
      right: { text: 'DESIGN', y: 40, from: 50, to: -110 },
      subSize: 15,
      subWidth: 260,
    },
    mobile: {
      fontVw: 17,
      left: { text: 'MOTION', y: 64, from: -75, to: 115 },
      right: { text: 'DESIGN', y: 36, from: 75, to: -115 },
      subSize: 12,
      subWidth: 200,
    },
  },
};

// growing lines between rows (one line per gap between rows)
type LineConfig = {
  ranges: [number, number][]; // [start, end] of section progress for each line (top gap first)
  color: string;
  thickness: number;
  insetLeft: string;
  insetRight: string;
  offsetY: number;
};

const LINES: Record<Breakpoint, LineConfig> = {
  desktop: { ranges: [[0.1, 0.51]], color: 'rgba(104, 103, 103, 0.28)', thickness: 1, insetLeft: '2.6vw', insetRight: '1.8vw', offsetY: 0 },
  tablet: { ranges: [[0.1, 0.51]], color: 'rgba(104, 103, 103, 0.28)', thickness: 1, insetLeft: '3vw', insetRight: '3vw', offsetY: 0 },
  mobile: {
    ranges: [
      [0.1, 0.6], // line between row 1 and row 2
      [0.3, 0.8], // line between row 2 and row 3
    ],
    color: 'rgba(104, 103, 103, 0.28)',
    thickness: 1,
    insetLeft: '4vw',
    insetRight: '4vw',
    offsetY: 0,
  },
};

// ------------------------------------------------------------
// CARDS
//  - top-level fields = desktop
//  - tablet: {} = optional overrides (empty = same as desktop)
//  - mobile: {} = overrides for phones (full control: slot, direction, timing, wave)
//
//  mobile.from.direction: 'left' | 'right' | 'top' | 'bottom' |
//                         'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom'
//  mobile.from.distance : 1 = fully off-screen. Use 'custom' + x / y for exact values.
//  mobile.wave.fixed    : which part of the card stays fixed while it waves
// ------------------------------------------------------------

const DEFAULTS: { cards: CardData[] } = {
  cards: [
    {
      id: 1,
      alt: 'Project 01',
      column: 0,
      row: 0,
      offset: { x: 0, y: 0 },
      from: { x: -0.7, y: -0.9, rotate: 0, scale: 0.9 },
      timing: { start: 0, duration: 0.32, ease: 'cubicOut' },
      wave: {
        fixed: 'top-left',
        angle: 45,
        fixedSize: 0,
        softness: 1,
        waves: 1.07,
        reverse: false,
        bend: 1,
        stretch: 0.35,
        ripple: 0.4,
        amplitude: 0.38,
        speed: 2.72,
        phase: 1.34,
        fadeInEnd: 0.08,
        fadeOutStart: 0.7,
      },
      tablet: {},
      mobile: {
        column: 0,
        row: 0,
        from: { direction: 'top-left', distance: 1, rotate: 0, scale: 0.9 },
        timing: { start: 0, duration: 0.3 },
        wave: { fixed: 'top-left' },
      },
    },
    {
      id: 2,
      alt: 'Project 02',
      column: 1,
      row: 0,
      offset: { x: 0, y: 0 },
      from: { x: 0, y: -1, rotate: 0, scale: 0.9 },
      timing: { start: 0.05, duration: 0.31, ease: 'cubicOut' },
      wave: {
        fixed: 'top',
        angle: 90,
        fixedSize: 0,
        softness: 0.7,
        waves: 0.77,
        reverse: false,
        bend: 0.35,
        stretch: 1,
        ripple: 0.5,
        amplitude: 0.38,
        speed: 2.72,
        phase: 1.3,
        fadeInEnd: 0.08,
        fadeOutStart: 0.7,
      },
      tablet: {},
      mobile: {
        column: 1,
        row: 0,
        from: { direction: 'top-right', distance: 1, rotate: 0, scale: 0.9 },
        timing: { start: 0.1, duration: 0.3 },
        wave: { fixed: 'top-right', bend: 1, stretch: 0.35 },
      },
    },
    {
      id: 3,
      alt: 'Project 03',
      column: 2,
      row: 0,
      offset: { x: 0, y: 0 },
      from: { x: 0.7, y: -0.9, rotate: 0, scale: 0.9 },
      timing: { start: 0.1, duration: 0.36, ease: 'cubicOut' },
      wave: {
        fixed: 'top-right',
        angle: 135,
        fixedSize: 0,
        softness: 1,
        waves: 0.77,
        reverse: false,
        bend: 1,
        stretch: 0.35,
        ripple: 0.4,
        amplitude: 0.38,
        speed: 2.72,
        phase: 2.6,
        fadeInEnd: 0.08,
        fadeOutStart: 0.7,
      },
      tablet: {},
      mobile: {
        column: 0,
        row: 1,
        from: { direction: 'bottom-left', distance: 1.1, rotate: 0, scale: 0.9 },
        timing: { start: 0.2, duration: 0.3 },
        wave: { fixed: 'bottom-left', bend: 1, stretch: 0.35 },
      },
    },
    {
      id: 4,
      alt: 'Project 04',
      column: 0,
      row: 1,
      offset: { x: 0, y: 0 },
      from: { x: -0.7, y: 0.87, rotate: 0, scale: 0.9 },
      timing: { start: 0.15, duration: 0.34, ease: 'cubicOut' },
      wave: {
        fixed: 'bottom-left',
        angle: -45,
        fixedSize: 0,
        softness: 1,
        waves: 0.77,
        reverse: false,
        bend: 1,
        stretch: 0.35,
        ripple: 0.4,
        amplitude: 0.38,
        speed: 2.72,
        phase: 2.68,
        fadeInEnd: 0.08,
        fadeOutStart: 0.66,
      },
      tablet: {},
      mobile: {
        column: 1,
        row: 1,
        from: { direction: 'bottom-right', distance: 1.1, rotate: 0, scale: 0.9 },
        timing: { start: 0.3, duration: 0.3 },
        wave: { fixed: 'bottom-right', bend: 1, stretch: 0.35 },
      },
    },
    {
      id: 5,
      alt: 'Project 05',
      column: 1,
      row: 1,
      offset: { x: 0, y: 0 },
      from: { x: 0, y: 1, rotate: -8, scale: 0.9 },
      timing: { start: 0.2, duration: 0.31, ease: 'cubicOut' },
      wave: {
        fixed: 'top',
        angle: -90,
        fixedSize: 0,
        softness: 0.7,
        waves: 0.77,
        reverse: false,
        bend: 0,
        stretch: 1,
        ripple: 0.5,
        amplitude: 0.38,
        speed: 2.72,
        phase: 1.34,
        fadeInEnd: 0.08,
        fadeOutStart: 0.7,
      },
      tablet: {},
      mobile: {
        column: 0,
        row: 2,
        from: { direction: 'bottom-left', distance: 1, rotate: 0, scale: 0.9 },
        timing: { start: 0.4, duration: 0.3 },
        wave: { fixed: 'bottom-left', bend: 1, stretch: 0.35 },
      },
    },
    {
      id: 6,
      alt: 'Project 06',
      column: 2,
      row: 1,
      offset: { x: 1, y: -2 },
      from: { x: 0.7, y: 0.84, rotate: -14, scale: 0.9 },
      timing: { start: 0.25, duration: 0.27, ease: 'cubicOut' },
      wave: {
        fixed: 'bottom-right',
        angle: -135,
        fixedSize: 0,
        softness: 1,
        waves: 0.77,
        reverse: false,
        bend: 1,
        stretch: 0.35,
        ripple: 0.4,
        amplitude: 0.38,
        speed: 2.72,
        phase: 2.68,
        fadeInEnd: 0.08,
        fadeOutStart: 0.7,
      },
      tablet: {},
      mobile: {
        column: 1,
        row: 2,
        offset: { x: 0, y: 0 },
        from: { direction: 'bottom-right', distance: 1, rotate: 0, scale: 0.9 },
        timing: { start: 0.5, duration: 0.3 },
        wave: { fixed: 'bottom-right' },
      },
    },
  ],
};

const IMAGES: Record<number, any> = { 1: work01, 2: work02, 3: work03, 4: work04, 5: work05, 6: work06 };

// ============================================================
// HELPERS
// ============================================================

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const src = (img: any): string => (typeof img === 'string' ? img : img.src);

const EASES: Record<EaseName, (t: number) => number> = {
  linear: (t) => t,
  sineInOut: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  quadOut: (t) => 1 - (1 - t) * (1 - t),
  cubicOut: (t) => 1 - Math.pow(1 - t, 3),
  quartOut: (t) => 1 - Math.pow(1 - t, 4),
  expoOut: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  backOut: (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
};

const PRESET_ANGLE: Record<Exclude<FixedPreset, 'custom' | 'none'>, number> = {
  'top-left': 45,
  top: 90,
  'top-right': 135,
  left: 0,
  right: 180,
  'bottom-left': -45,
  bottom: -90,
  'bottom-right': -135,
};

const angleOf = (w: WaveParams) => (w.fixed === 'custom' || w.fixed === 'none' ? w.angle : PRESET_ANGLE[w.fixed]);

// which side the card enters from (x = vw, y = vh)
const DIRS: Record<Exclude<Direction, 'custom'>, [number, number]> = {
  left: [-1, 0],
  right: [1, 0],
  top: [0, -1],
  bottom: [0, 1],
  'top-left': [-1, -1],
  'top-right': [1, -1],
  'bottom-left': [-1, 1],
  'bottom-right': [1, 1],
};

function fromVector(f: FromConfig): [number, number] {
  if (!f.direction || f.direction === 'custom') return [f.x, f.y];
  const [dx, dy] = DIRS[f.direction];
  const d = f.distance ?? 1;
  return [dx * d, dy * d];
}

function resolveCard(c: CardData, bp: Breakpoint): ResolvedCard {
  const o: CardOverride | undefined = bp === 'mobile' ? c.mobile : bp === 'tablet' ? c.tablet : undefined;
  return {
    id: c.id,
    alt: c.alt,
    image: IMAGES[c.id],
    column: o?.column ?? c.column,
    row: o?.row ?? c.row,
    offset: o?.offset ?? c.offset,
    from: { ...c.from, ...o?.from },
    timing: { ...c.timing, ...o?.timing },
    wave: { ...c.wave, ...o?.wave },
  };
}

function useResponsive() {
  const [size, setSize] = useState({ vw: 1440, vh: 800 });

  useEffect(() => {
    const update = () => setSize({ vw: window.innerWidth, vh: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const bp: Breakpoint = size.vw < BREAKPOINTS.mobile ? 'mobile' : size.vw < BREAKPOINTS.tablet ? 'tablet' : 'desktop';
  const cfg = LAYOUTS[bp];
  const w = clamp((size.vw * cfg.cardWidthVw) / 100, cfg.minW, cfg.maxW);

  return { ...size, bp, cfg, w, h: w * cfg.aspect };
}

type Layout = ReturnType<typeof useResponsive>;

// ============================================================
// FABRIC WAVE IMAGE (WebGL)
// ============================================================

const PAD = 0.2;
const MESH_SCALE = 1 / (1 + PAD * 2);

const VERT = `
  attribute vec2 a_position;
  attribute vec2 a_uv;

  uniform float u_time;
  uniform float u_amplitude;
  uniform float u_waves;
  uniform float u_meshScale;
  uniform vec2 u_dir;
  uniform float u_tMin;
  uniform float u_tRange;
  uniform float u_fixedSize;
  uniform float u_softness;
  uniform float u_all;
  uniform float u_bend;
  uniform float u_stretch;
  uniform float u_ripple;

  varying vec2 v_uv;

  void main() {
    vec2 p = a_position;
    vec2 q = vec2((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5);

    float t = (dot(q, u_dir) - u_tMin) / u_tRange;

    float weight = 1.0;
    if (u_all < 0.5) {
      weight = smoothstep(u_fixedSize, u_fixedSize + max(u_softness, 0.001), t);
    }

    vec2 axisC = vec2(u_dir.x, -u_dir.y);
    vec2 perpC = vec2(-axisC.y, axisC.x);
    float c = dot(q, vec2(-u_dir.y, u_dir.x));

    float ph = t * u_waves * 6.2831853 - u_time;
    float wave = sin(ph) + u_ripple * sin(ph * 0.53 - u_time * 0.35 + c * 3.0);
    float along = cos(ph * 0.8 - u_time * 0.6);

    p += (perpC * wave * u_bend + axisC * along * u_stretch) * u_amplitude * weight;

    v_uv = a_uv;
    gl_Position = vec4(p * u_meshScale, 0.0, 1.0);
  }
`;

const FRAG = `
  precision mediump float;

  uniform sampler2D u_texture;
  uniform vec2 u_coverScale;
  uniform vec2 u_cardSize;
  uniform float u_radius;

  varying vec2 v_uv;

  void main() {
    vec2 uv = 0.5 + (v_uv - 0.5) * u_coverScale;
    vec4 color = texture2D(u_texture, uv);

    vec2 q = abs((v_uv - 0.5) * u_cardSize) - (u_cardSize * 0.5 - u_radius);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - u_radius;
    float alpha = 1.0 - smoothstep(-0.75, 0.75, d);

    gl_FragColor = vec4(color.rgb * alpha, alpha);
  }
`;

type FabricWaveImageProps = {
  src: string;
  alt: string;
  t: MotionValue<number>;
  cardRef: React.MutableRefObject<ResolvedCard>;
  layoutRef: React.MutableRefObject<Layout>;
};

function FabricWaveImage({ src: imageSrc, alt, t, cardRef, layoutRef }: FabricWaveImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) return;

    let destroyed = false;
    let ready = false;
    let imageAspect = 1;
    let raf = 0;
    let running = false;

    const image = new Image();
    image.decoding = 'async';
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // ---------- mesh ----------
    const cols = 60;
    const rows = 60;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let r = 0; r <= rows; r++) {
      const v = r / rows;
      for (let c = 0; c <= cols; c++) {
        const u = c / cols;
        positions.push(u * 2 - 1, 1 - v * 2);
        uvs.push(u, 1 - v);
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = r * (cols + 1) + c;
        const b = a + 1;
        const d = a + cols + 1;
        const e = d + 1;
        indices.push(a, d, b, b, d, e);
      }
    }

    const bind = (data: number[], name: string) => {
      const buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      return buf;
    };

    const positionBuffer = bind(positions, 'a_position');
    const uvBuffer = bind(uvs, 'a_uv');

    const indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // ---------- uniforms ----------
    const U = (n: string) => gl.getUniformLocation(program, n);
    const uTime = U('u_time');
    const uAmp = U('u_amplitude');
    const uWaves = U('u_waves');
    const uMesh = U('u_meshScale');
    const uDir = U('u_dir');
    const uTMin = U('u_tMin');
    const uTRange = U('u_tRange');
    const uFixedSize = U('u_fixedSize');
    const uSoftness = U('u_softness');
    const uAll = U('u_all');
    const uBend = U('u_bend');
    const uStretch = U('u_stretch');
    const uRipple = U('u_ripple');
    const uTex = U('u_texture');
    const uCover = U('u_coverScale');
    const uCard = U('u_cardSize');
    const uRadius = U('u_radius');

    // ---------- texture ----------
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([230, 230, 230, 255]));

    const smooth = (x: number) => x * x * (3 - 2 * x);

    const amplitudeAt = (v: number, wv: WaveParams) => {
      const fadeIn = clamp(v / Math.max(wv.fadeInEnd, 0.001), 0, 1);
      const fadeOut = 1 - clamp((v - wv.fadeOutStart) / Math.max(1 - wv.fadeOutStart, 0.001), 0, 1);
      return smooth(fadeIn) * smooth(fadeOut);
    };

    // ---------- draw one frame ----------
    const draw = () => {
      if (destroyed || !ready) return;

      const wv = cardRef.current.wave;
      const radius = layoutRef.current.cfg.radius;

      const v = clamp(t.get(), 0, 1);
      const w = container.clientWidth;
      const h = container.clientHeight;
      const cardAspect = w / h;
      const cover: [number, number] = cardAspect > imageAspect ? [1, imageAspect / cardAspect] : [cardAspect / imageAspect, 1];

      const rad = (angleOf(wv) * Math.PI) / 180;
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);
      const proj = [0, dx, dy, dx + dy];
      const tMin = Math.min(...proj);
      const tRange = Math.max(Math.max(...proj) - tMin, 0.001);

      const env = amplitudeAt(v, wv);
      const time = ((performance.now() / 1000) * wv.speed + wv.phase) * (wv.reverse ? -1 : 1);

      gl.useProgram(program);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTime, time);
      gl.uniform1f(uAmp, env * GLOBAL.waveAmplitude * wv.amplitude);
      gl.uniform1f(uWaves, wv.waves);
      gl.uniform1f(uMesh, MESH_SCALE);
      gl.uniform2f(uDir, dx, dy);
      gl.uniform1f(uTMin, tMin);
      gl.uniform1f(uTRange, tRange);
      gl.uniform1f(uFixedSize, wv.fixedSize);
      gl.uniform1f(uSoftness, wv.softness);
      gl.uniform1f(uAll, wv.fixed === 'none' ? 1 : 0);
      gl.uniform1f(uBend, wv.bend);
      gl.uniform1f(uStretch, wv.stretch);
      gl.uniform1f(uRipple, wv.ripple);
      gl.uniform2f(uCover, cover[0], cover[1]);
      gl.uniform2f(uCard, w, h);
      gl.uniform1f(uRadius, radius);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uTex, 0);

      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    };

    // ---------- loop: runs only while the card is in flight ----------
    const active = () => {
      const v = t.get();
      return v > 0 && v < 1;
    };

    const loop = () => {
      if (destroyed) return;
      draw();
      if (active()) raf = requestAnimationFrame(loop);
      else running = false;
    };

    const startLoop = () => {
      if (running || destroyed) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const onProgress = () => {
      if (active()) startLoop();
      else draw();
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = w * (1 + PAD * 2);
      const ch = h * (1 + PAD * 2);

      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      onProgress();
    };

    image.onload = () => {
      if (destroyed) return;
      imageAspect = image.naturalWidth / image.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      ready = true;
      resize();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const unsubscribe = t.on('change', onProgress);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      unsubscribe();
      ro.disconnect();
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(uvBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [imageSrc, t, cardRef, layoutRef]);

  return (
    <div ref={containerRef} role="img" aria-label={alt} className="relative h-full w-full">
      <canvas ref={canvasRef} className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

// ============================================================
// CARD
// ============================================================

type RevealCardProps = {
  card: ResolvedCard;
  index: number;
  progress: MotionValue<number>;
  layout: Layout;
  layoutRef: React.MutableRefObject<Layout>;
};

function RevealCard({ card, index, progress, layout, layoutRef }: RevealCardProps) {
  const cardRef = useRef(card);
  cardRef.current = card;

  // bumps whenever the card or the screen size changes so everything recomputes
  const tick = useMotionValue(0);
  useEffect(() => {
    tick.set(tick.get() + 1);
  }, [card, layout.bp, layout.w, layout.h, layout.vw, layout.vh, tick]);

  // this card's own 0 → 1 progress
  const t = useTransform([progress, tick], (latest: number[]) => {
    const { start, duration } = cardRef.current.timing;
    return clamp((latest[0] - start) / Math.max(duration, 0.001), 0, 1);
  });

  // ONE grouped transform: position + rotation + scale
  const transform = useTransform([t, tick], (latest: number[]) => {
    const { vw, vh, w, h, cfg } = layoutRef.current;
    const c = cardRef.current;

    const ease = EASES[c.timing.ease](latest[0]);
    const rem = 1 - ease;

    const targetX = (c.column - (cfg.cols - 1) / 2) * (w + cfg.gapX) + c.offset.x;
    const targetY = (c.row - (cfg.rows - 1) / 2) * (h + cfg.gapY) + c.offset.y;

    const [fx, fy] = fromVector(c.from);
    const x = targetX + fx * vw * rem;
    const y = targetY + fy * vh * rem;
    const rotate = c.from.rotate * rem;
    const scale = c.from.scale + (1 - c.from.scale) * ease;

    return `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
  });

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{
        transform,
        width: layout.w,
        height: layout.h,
        marginLeft: -layout.w / 2,
        marginTop: -layout.h / 2,
        zIndex: index + 10,
      }}
    >
      <FabricWaveImage src={src(card.image)} alt={card.alt} t={t} cardRef={cardRef} layoutRef={layoutRef} />
    </motion.div>
  );
}

// ============================================================
// INTRO TEXTS + GROWING LINES
// ============================================================

function IntroText({ introProgress, bp }: { introProgress: MotionValue<number>; bp: Breakpoint }) {
  const cfg = INTRO.bp[bp];
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;

  const t = useTransform(introProgress, (p) => clamp((p - INTRO.start) / Math.max(INTRO.end - INTRO.start, 0.001), 0, 1));

  // one grouped transform per text
  const leftX = useTransform(t, (v) => `translate3d(${lerp(cfgRef.current.left.from, cfgRef.current.left.to, v)}vw, 0, 0)`);
  const rightX = useTransform(t, (v) => `translate3d(${lerp(cfgRef.current.right.from, cfgRef.current.right.to, v)}vw, 0, 0)`);
  const subOpacity = useTransform(t, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);

  const base = 'pointer-events-none absolute select-none whitespace-nowrap font-medium uppercase leading-[0.8] tracking-[-0.06em] will-change-transform';
  const size = { fontSize: `${cfg.fontVw}vw`, color: INTRO.color };
  const go = usePageTransition();
  return (
    <>
      <motion.div className={`${base} left-0`} style={{ ...size, top: `calc(${cfg.left.y}% - 0.4em)`, transform: leftX }}>
        {cfg.left.text}
      </motion.div>
      <motion.div className={`${base} right-0`} style={{ ...size, top: `calc(${cfg.right.y}% - 0.4em)`, transform: rightX }}>
        {cfg.right.text}
      </motion.div>
      <motion.p
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 text-center uppercase leading-[1.1] tracking-[-0.02em]"
        style={{ color: INTRO.color, opacity: subOpacity, width: cfg.subWidth, fontSize: cfg.subSize }}
      >
        {INTRO.subtitle}
      </motion.p>
      <motion.p className="pointer-events-none absolute left-1/2 top-[11%] w-[280px] -translate-x-1/2 px-6 text-center text-[15px] leading-[1.1] tracking-[-0.02em] text-[#444] md:left-auto md:top-[90%] md:w-[270px] md:translate-x-0 md:text-left lg:top-[85%]">
        Concepts, explorations, and interface experiments shared openly as part of our creative process.
      </motion.p>
      <AnimatedButton
        onClick={() => go('/portfolio', 'WORK')}
        variant="animated"
        textColor="#4A4A4A"
        hoverTextColor="#000"
        borderColor="#4A4A4A"
        hoverBorderColor="#000"
        iconColor="#4A4A4A"
        icon="up-right"
        hoverIconColor="#000"
        charShift={38}
        charStagger={0.025}
        charDuration={0.75}
        widthClassName="w-[160px] sm:w-[160px] md:w-[160px] lg:w-[160px]"
        className="group absolute left-1/2 top-[80%] mt-12 flex -translate-x-1/2 items-center font-mono uppercase md:left-[76%] md:top-[85%] md:translate-x-0 lg:left-[87.5%] lg:top-[80%] xl:left-[calc(100vw-3vw-160px)] xl:translate-x-0 2xl:left-[87.5%]"
      >
        VIEW ALL PROJECTS
      </AnimatedButton>
    </>
  );
}

function GrowLine({ progress, range, y, bp }: { progress: MotionValue<number>; range: [number, number]; y: number; bp: Breakpoint }) {
  const cfg = LINES[bp];
  const rangeRef = useRef(range);
  rangeRef.current = range;

  const scaleX = useTransform(progress, (p) => {
    const [s, e] = rangeRef.current;
    return clamp((p - s) / Math.max(e - s, 0.001), 0, 1);
  });

  return (
    <motion.div
      className="pointer-events-none absolute origin-left will-change-transform"
      style={{
        top: `calc(50% + ${y + cfg.offsetY}px)`,
        left: cfg.insetLeft,
        right: cfg.insetRight,
        height: cfg.thickness,
        background: cfg.color,
        scaleX,
      }}
    />
  );
}

// ============================================================
// SECTION
// ============================================================

export default function HomeCard() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const layout = useResponsive();
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const cards = useMemo(() => DEFAULTS.cards.map((c) => resolveCard(c, layout.bp)), [layout.bp]);

  // cards + lines progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const raw = useTransform(scrollYProgress, (v) => clamp(v / layoutRef.current.cfg.scrollEnd, 0, 1));
  const progress = useSpring(raw, GLOBAL.spring);

  // intro texts: start when the section reaches the screen center, run until the section ends
  const { scrollYProgress: introRaw } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end end'],
  });
  const introProgress = useSpring(introRaw, GLOBAL.spring);

  // one line in every gap between rows
  const { cfg, h } = layout;
  const lineRanges = LINES[layout.bp].ranges;
  const lines = Array.from({ length: cfg.rows - 1 }, (_, i) => ({
    y: (i + 0.5 - (cfg.rows - 1) / 2) * (h + cfg.gapY),
    range: lineRanges[Math.min(i, lineRanges.length - 1)],
  }));

  return (
    <section ref={sectionRef} className="relative w-full bg-[linear-gradient(180deg,#D2D2D2_0%,#FFFFFF_100%)]" style={{ height: `${cfg.sectionVh}vh` }}>
      <div className="translate-y-8 px-7 sm:translate-y-8 md:translate-y-10 lg:translate-y-[10px]">
        {/* Tablet */}
        <div className="hidden translate-y-10 md:block lg:hidden">
          <LinePlusBlock
            lineColor="#4A4A4A"
            lineOpacity={0.2}
            lineHeight={1}
            lineWidth="100%"
            lineOrigin="left"
            plusPosition="clamp(49%, calc(49% + (100vw - 900px) * 0.04), 52%)"
            plusSize={14}
            plusStrokeWidth={2.5}
            plusColor="#4A4A4A"
            plusOpacity={0.7}
            plusTop="3.2px"
            rotateFrom={0}
            rotateTo={360}
            scrollStart="start 92%"
            scrollEnd="start 50%"
          />
        </div>

        {/* Large desktop */}
        <div className="hidden translate-y-10 lg:block xl:hidden">
          <LinePlusBlock
            lineColor="#4A4A4A"
            lineOpacity={0.2}
            lineHeight={1}
            lineWidth="100%"
            lineOrigin="left"
            plusPosition="clamp(9%, calc(9% + (100vw - 1024px) * 0.12), 20%)"
            plusSize={14}
            plusStrokeWidth={2.5}
            plusColor="#4A4A4A"
            plusOpacity={0.7}
            plusTop="3.2px"
            rotateFrom={0}
            rotateTo={360}
            scrollStart="start 77%"
            scrollEnd="start 20%"
          />
        </div>

        {/* XL */}
        <div className="hidden translate-y-10 xl:block 2xl:hidden">
          <LinePlusBlock
            lineColor="#4A4A4A"
            lineOpacity={0.2}
            lineHeight={1}
            lineWidth="100%"
            lineOrigin="left"
            plusPosition="clamp(49%, calc(42% + (100vw - 1280px) * 0.0), 59%)"
            plusSize={14}
            plusStrokeWidth={2.5}
            plusColor="#4A4A4A"
            plusOpacity={0.7}
            plusTop="3.2px"
            rotateFrom={0}
            rotateTo={360}
            scrollStart="start 92%"
            scrollEnd="start 15%"
          />
        </div>

        {/* 2XL and above */}
        <div className="hidden translate-y-5 2xl:block">
          <LinePlusBlock
            lineColor="#4A4A4A"
            lineOpacity={0.2}
            lineHeight={1}
            lineWidth="100%"
            lineOrigin="left"
            plusPosition="clamp(49%, calc(49% + (100vw - 1536px) * 0.035), 59%)"
            plusSize={14}
            plusStrokeWidth={2.5}
            plusColor="#4A4A4A"
            plusOpacity={0.7}
            plusTop="3.2px"
            rotateFrom={0}
            rotateTo={360}
            scrollStart="start 93%"
            scrollEnd="start 20%"
          />
        </div>
      </div>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <IntroText introProgress={introProgress} bp={layout.bp} />

        {lines.map((l, i) => (
          <GrowLine key={`${layout.bp}-${i}`} progress={progress} range={l.range} y={l.y} bp={layout.bp} />
        ))}

        {cards.map((card, index) => (
          <RevealCard key={card.id} card={card} index={index} progress={progress} layout={layout} layoutRef={layoutRef} />
        ))}
      </div>
    </section>
  );
}
