/* ============================================================
   FLOATING MOTION CONFIG
============================================================ */

export const TOTAL_CARDS = 21;

export const MOBILE_CARD_COUNT = 11;

/* ============================================================
   DESKTOP BATCHES
============================================================ */

export const BATCH_SIZES = [4, 3, 4, 3, 2, 2];

export const BATCH_START = 0.08;

export const BATCH_STEP = 0.15;

export const BATCH_DURATION = 0.11;

/* ============================================================
   MOBILE BATCHES
   11 cards -> 6 magnetic groups
============================================================ */

export const MOBILE_BATCH_SIZES = [2, 2, 2, 2, 2, 1];

export const MOBILE_BATCH_START = 0.06;

export const MOBILE_BATCH_STEP = 0.145;

export const MOBILE_BATCH_DURATION = 0.12;

export const CARD_HIDE_PROGRESS = 0.94;

export type FloatingMotionConfig = {
  FADE_FRACTION: number;
  HOLD_FRACTION: number;

  DRIFT_RANGE: [number, number];

  POSITION_RANGE_X: [number, number];
  POSITION_RANGE_Y: [number, number];

  TILT_RANGE: [number, number];

  SCALE_RANGE: [number, number];

  CARD_WIDTH_RANGE: [number, number];

  CARD_ASPECT_RANGE: [number, number];

  BLINK_COUNT_MIN: number;
  BLINK_COUNT_MAX: number;

  DURATION_MIN: number;
  DURATION_MAX: number;

  INITIAL_HOLD_SECONDS: number;
};

/* ============================================================
   DESKTOP CONFIG
   KEEPING YOUR CURRENT VALUES
============================================================ */

export const DEFAULT_FLOATING_CONFIG: FloatingMotionConfig = {
  FADE_FRACTION: 0.28,
  HOLD_FRACTION: 1.95,

  DRIFT_RANGE: [-20, 20],

  POSITION_RANGE_X: [-70, 70],
  POSITION_RANGE_Y: [-65, 65],

  TILT_RANGE: [-8, 8],

  SCALE_RANGE: [0.85, 1],

  CARD_WIDTH_RANGE: [80, 180],

  CARD_ASPECT_RANGE: [1.15, 1.95],

  BLINK_COUNT_MIN: 2,
  BLINK_COUNT_MAX: 5,

  DURATION_MIN: 5,
  DURATION_MAX: 20,

  INITIAL_HOLD_SECONDS: 3.5,
};

/* ============================================================
   MOBILE CONFIG
   Based around a 390px wide phone.

   Width is later scaled according to actual viewport width.
============================================================ */

export const MOBILE_FLOATING_CONFIG: FloatingMotionConfig = {
  FADE_FRACTION: 0.24,
  HOLD_FRACTION: 1.65,

  // Movement during each appearance
  DRIFT_RANGE: [-18, 18],

  // Full mobile viewport
  // Allows cards to travel from far left
  // to far right and slightly outside screen.
  POSITION_RANGE_X: [78, -48],

  // Full viewport height
  POSITION_RANGE_Y: [-48, 88],

  TILT_RANGE: [-17, 7],

  SCALE_RANGE: [0.52, 0.8],

  // Responsive width is calculated in FloatingProjectCard
  CARD_WIDTH_RANGE: [95, 155],

  CARD_ASPECT_RANGE: [1.15, 1.75],

  BLINK_COUNT_MIN: 2,
  BLINK_COUNT_MAX: 4,

  DURATION_MIN: 4,
  DURATION_MAX: 11,

  INITIAL_HOLD_SECONDS: 3.5,
};

/* ============================================================
   DETERMINISTIC RANDOM
============================================================ */

export function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999.91) * 43758.5453;

  return x - Math.floor(x);
}

export function randomBetween(seed: number, min: number, max: number) {
  return min + seededRandom(seed) * (max - min);
}

/* ============================================================
   BATCH INDEX
============================================================ */

export function getBatchIndex(cardIndex: number, batchSizes: number[] = BATCH_SIZES) {
  let count = 0;

  for (let batch = 0; batch < batchSizes.length; batch++) {
    count += batchSizes[batch];

    if (cardIndex < count) {
      return batch;
    }
  }

  return batchSizes.length - 1;
}

/* ============================================================
   BLINK / PATH MOTION
============================================================ */

export type BlinkSlot = {
  x: number;
  y: number;

  driftX: number;
  driftY: number;

  scale: number;
  rotate: number;

  width: number;
  aspect: number;
};

export function createFloatingMotion(index: number, config: FloatingMotionConfig = DEFAULT_FLOATING_CONFIG) {
  const blinkCount = Math.round(randomBetween(index + 950, config.BLINK_COUNT_MIN, config.BLINK_COUNT_MAX));

  const slots: BlinkSlot[] = [];

  for (let i = 0; i < blinkCount; i++) {
    const seed = index * 211 + i * 53;

    slots.push({
      x: Number(randomBetween(seed + 1, config.POSITION_RANGE_X[0], config.POSITION_RANGE_X[1]).toFixed(2)),

      y: Number(randomBetween(seed + 2, config.POSITION_RANGE_Y[0], config.POSITION_RANGE_Y[1]).toFixed(2)),

      driftX: Number(randomBetween(seed + 3, config.DRIFT_RANGE[0], config.DRIFT_RANGE[1]).toFixed(2)),

      driftY: Number(randomBetween(seed + 4, config.DRIFT_RANGE[0], config.DRIFT_RANGE[1]).toFixed(2)),

      scale: Number(randomBetween(seed + 5, config.SCALE_RANGE[0], config.SCALE_RANGE[1]).toFixed(2)),

      rotate: Number(randomBetween(seed + 6, config.TILT_RANGE[0], config.TILT_RANGE[1]).toFixed(2)),

      width: Math.round(randomBetween(seed + 8, config.CARD_WIDTH_RANGE[0], config.CARD_WIDTH_RANGE[1])),

      aspect: Number(randomBetween(seed + 9, config.CARD_ASPECT_RANGE[0], config.CARD_ASPECT_RANGE[1]).toFixed(2)),
    });
  }

  const duration = randomBetween(index + 100, config.DURATION_MIN, config.DURATION_MAX);

  return {
    blinkCount,
    slots,
    duration,
    delay: 0,
  };
}

/* ============================================================
   EASING
============================================================ */

export function smoothstep(x: number) {
  const c = Math.min(1, Math.max(0, x));

  return c * c * (3 - 2 * c);
}

export function easeOutCubic(x: number) {
  const c = Math.min(1, Math.max(0, x));

  return 1 - Math.pow(1 - c, 3);
}
