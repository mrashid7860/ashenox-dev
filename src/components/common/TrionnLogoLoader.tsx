'use client';

import { useMemo } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

/* ============================================================
   HELPERS
   ============================================================ */

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(x: number) {
  const c = clamp(x, 0, 1);
  return c * c * (3 - 2 * c);
}

function seededRandom(seed: number) {
  let s = seed % 2147483647;

  if (s <= 0) {
    s += 2147483646;
  }

  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ============================================================
   HAND-DRAWN WAVY LINE GENERATOR
   ============================================================ */

function buildWavePath(start: number, end: number, fixedCoord: number, seed: number, axis: 'horizontal' | 'vertical', amplitude = 9, segments = 30) {
  const rand = seededRandom(seed);

  const freq1 = 0.6 + rand() * 1.4;
  const freq2 = 1.6 + rand() * 2.4;

  const phase1 = rand() * Math.PI * 2;
  const phase2 = rand() * Math.PI * 2;

  const amp1 = amplitude * (0.5 + rand() * 0.5);
  const amp2 = amplitude * 0.3 * (0.4 + rand() * 0.6);

  let d = '';

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    const pos = start + (end - start) * t;

    const wobble = Math.sin(t * Math.PI * 2 * freq1 + phase1) * amp1 + Math.sin(t * Math.PI * 2 * freq2 + phase2) * amp2;

    const perp = fixedCoord + wobble;

    const x = axis === 'horizontal' ? pos : perp;
    const y = axis === 'horizontal' ? perp : pos;

    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)} ` : `L ${x.toFixed(1)} ${y.toFixed(1)} `;
  }

  return d.trim();
}

/* ============================================================
   GEOMETRY
   ============================================================ */

type Axis = 'x' | 'y';

interface ShapeGeometry {
  axisFrom: number;
  axisTo: number;
  crossStart: number;
  crossLength: number;
  fillAxis: Axis;
  direction: 1 | -1;
}

/* ============================================================
   GLOBAL FILL SETTINGS
   ============================================================ */

const EDGE_SOFTNESS = 0.14;

/*
 * Slight overlap between neighboring rows.
 * This prevents tiny hairline gaps.
 */
const ROW_OVERLAP = 1.5;

/*
 * How long the glow stays visible after a row
 * has passed the drawing point.
 */
const GLOW_FADE_RANGE = 0.4;
/* colors flipped for the light loader background */
const FILL_COLOR = '#4A4A4A';
const OUTLINE_COLOR = '#A9A9A9';

/* ============================================================
   FILL ROW
   ============================================================ */

function FillRow({
  progress,
  t,
  transitionWidth,
  rowThickness,
  anchor,
  direction,
  crossStart,
  crossLength,
  fillAxis,
  wavePath,
}: {
  progress: MotionValue<number>;
  t: number;
  transitionWidth: number;
  rowThickness: number;
  anchor: number;
  direction: 1 | -1;
  crossStart: number;
  crossLength: number;
  fillAxis: Axis;
  wavePath: string;
}) {
  const rowEnd = t + transitionWidth / 2;

  const revealAt = (p: number) => smoothstep((p - (t - transitionWidth / 2)) / transitionWidth);

  /*
   * Smooth reveal of this particular row.
   */
  const reveal = useTransform(progress, revealAt);

  /*
   * Physical size of the filled portion.
   */
  const bandSize = useTransform(reveal, (r) => (r > 0 ? r * rowThickness + ROW_OVERLAP : 0));

  /*
   * Move the fill from the outside toward the apex.
   */
  const axisPos = useTransform(bandSize, (size) => (direction === 1 ? anchor : anchor - size));

  /*
   * Animated hand-drawn line.
   */
  const dashoffset = useTransform(reveal, (r) => 1 - r);

  /*
   * Glow follows exactly the same reveal.
   */
  const glowOpacity = useTransform(progress, (p) => {
    const r = revealAt(p);

    const decay = clamp(1 - (p - rowEnd) / GLOW_FADE_RANGE, 0, 1);

    /*
     * Fade everything out very slightly at the
     * final completion of the Main A animation.
     */
    const shapeFade = clamp(1 - (p - 0.9) / 0.1, 0, 1);

    return r * decay * shapeFade;
  });

  /*
   * Convert the animated local geometry into
   * an SVG rectangle.
   */
  const rectProps =
    fillAxis === 'y'
      ? {
          x: crossStart,
          width: crossLength,
          y: axisPos,
          height: bandSize,
        }
      : {
          y: crossStart,
          height: crossLength,
          x: axisPos,
          width: bandSize,
        };

  return (
    <>
      <motion.rect {...rectProps} fill={FILL_COLOR} />

      <motion.path
        d={wavePath}
        fill="none"
        stroke={OUTLINE_COLOR}
        strokeWidth={1.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        style={{
          strokeDashoffset: dashoffset,
          opacity: glowOpacity,
        }}
      />
    </>
  );
}

/* ============================================================
   FILL LAYER
   ============================================================ */

function FillLayer({
  clipId,
  progress,
  geometry,
  rowCount,
  seedBase,
  transform,
}: {
  clipId: string;
  progress: MotionValue<number>;
  geometry: ShapeGeometry;
  rowCount: number;
  seedBase: number;

  /*
   * Optional SVG transform.
   *
   * The fill is generated in a local coordinate system
   * and then rotated around the Main A apex.
   */
  transform?: string;
}) {
  const { axisFrom, axisTo, crossStart, crossLength, fillAxis, direction } = geometry;

  /*
   * Each row represents an equal slice of the
   * diagonal fill.
   */
  const rowThickness = Math.abs(axisTo - axisFrom) / rowCount;

  const transitionWidth = EDGE_SOFTNESS;

  const rows = useMemo(
    () =>
      Array.from({ length: rowCount }).map((_, i) => {
        const rowStart = i / rowCount;

        const rowEndFrac = (i + 1) / rowCount;

        /*
         * IMPORTANT:
         *
         * axisFrom is intentionally extended past
         * the actual shape. This guarantees that
         * the fill reaches the complete outer tip.
         */
        const anchor = axisFrom + (axisTo - axisFrom) * rowStart;

        const leadingCoord = axisFrom + (axisTo - axisFrom) * rowEndFrac;

        const t = (i + 0.5) / rowCount;

        const wavePath = buildWavePath(crossStart, crossStart + crossLength, leadingCoord, seedBase + i, fillAxis === 'y' ? 'horizontal' : 'vertical');

        return {
          i,
          anchor,
          t,
          wavePath,
        };
      }),
    [axisFrom, axisTo, crossStart, crossLength, fillAxis, rowCount, seedBase]
  );

  const rowElements = rows.map((row) => (
    <FillRow
      key={row.i}
      progress={progress}
      t={row.t}
      transitionWidth={transitionWidth}
      rowThickness={rowThickness}
      anchor={row.anchor}
      direction={direction}
      crossStart={crossStart}
      crossLength={crossLength}
      fillAxis={fillAxis}
      wavePath={row.wavePath}
    />
  ));

  return <g clipPath={`url(#${clipId})`}>{transform ? <g transform={transform}>{rowElements}</g> : rowElements}</g>;
}

/* ============================================================
   MAIN A SVG PATH
   ============================================================ */

const MAIN_A_PATH = `
  M446 4
  L436 0
  L352 0
  L339 6
  L331 15

  L3 656
  L0 666
  L1 684
  L7 696
  L18 706

  L32 711
  L209 711
  L320 709
  L333 704
  L343 697

  L424 617
  L424 615
  L210 615
  L202 613
  L193 608
  L182 596
  L177 583
  L178 566

  L367 195
  L375 186
  L381 183
  L389 182
  L396 184
  L406 193

  L503 377
  L510 387
  L677 483
  L681 483
  L685 480
  L686 474

  L458 17
  L454 11
  Z
`;

/* ============================================================
   LOWER RIGHT PATH
   ============================================================ */

const LOWER_RIGHT_PATH = `
  M365 370
  L376 370
  L386 374
  L736 584
  L746 594
  L797 696
  L797 700
  L796 706
  L789 711
  L722 711
  L712 708
  L361 513
  L354 507
  L349 500
  L345 488
  L345 391
  L349 381
  L356 374
  Z
`;

/* ============================================================
   MAIN A — SHARED APEX
   ============================================================ */

const MAIN_A_APEX = {
  x: 390,
  y: 8,
};

/* ============================================================
   MAIN A — LEFT LEG
   ============================================================

   IMPORTANT:

   The angle is unchanged.

   Original:
   rotate(150.9)

   We keep exactly the same angle.

   The only major change is extending axisFrom,
   axisTo and crossLength so the fill completely
   covers the actual SVG path.
   ============================================================ */

const GEOMETRY_MAIN_A_LEFT: ShapeGeometry = {
  /*
   * Extended beyond the actual bottom-left tip.
   *
   * This prevents the fill from stopping early.
   */
  axisFrom: 700,

  /*
   * Slightly beyond the apex.
   *
   * This guarantees that the fill reaches the
   * exact top meeting point.
   */
  axisTo: 25,

  /*
   * Extra perpendicular coverage.
   *
   * The actual Main A path clips this excess away,
   * so it cannot appear outside the A.
   */
  crossStart: -700,
  crossLength: 700,

  fillAxis: 'x',

  /*
   * Outside → apex.
   */
  direction: -1,
};

/*
 * SAME LEFT ANGLE AS BEFORE.
 */
const MAIN_A_LEFT_TRANSFORM = `translate(${MAIN_A_APEX.x} ${MAIN_A_APEX.y}) rotate(160)`;

/* ============================================================
   MAIN A — RIGHT LEG
   ============================================================

   SAME RIGHT ANGLE.

   The fill geometry is simply extended so that
   it reaches the complete bottom-right tip.
   ============================================================ */

const GEOMETRY_MAIN_A_RIGHT: ShapeGeometry = {
  /*
   * Extended beyond the actual outer tip.
   */
  axisFrom: 200,

  /*
   * Slightly past the apex.
   */
  axisTo: -95,

  /*
   * More than enough perpendicular coverage.
   */
  crossStart: -700,
  crossLength: 1250,

  fillAxis: 'x',

  /*
   * Outside → apex.
   */
  direction: -1,
};

/*
 * SAME RIGHT ANGLE AS BEFORE.
 */
const MAIN_A_RIGHT_TRANSFORM = `translate(${MAIN_A_APEX.x} ${MAIN_A_APEX.y}) rotate(-20.6)`;

/* ============================================================
   LOWER RIGHT — BOTTOM → TOP
   ============================================================ */

const GEOMETRY_LOWER_RIGHT: ShapeGeometry = {
  axisFrom: 760,
  axisTo: -50,

  crossStart: -50,
  crossLength: 850,

  fillAxis: 'y',

  direction: -1,
};

/* ============================================================
   LOGO
   ============================================================ */
interface TrionnLogoProps {
  progress: MotionValue<number>;
}
const TrionnLogo = ({ progress }: TrionnLogoProps) => {
  const mainAProgress = useTransform(progress, [0, 1], [0, 1]); // was [0, 0.78]
  const lowerRightProgress = useTransform(progress, [0.1, 1], [0, 1]); // was [0.2, 1]

  /* ==========================================================
     MAIN A OUTLINE
     ========================================================== */

  const mainAOutlineStroke = useTransform(mainAProgress, [0, 1], [OUTLINE_COLOR, FILL_COLOR]);
  const mainAOutlineOpacity = useTransform(mainAProgress, [0, 1], [0.55, 1]);
  const lowerRightOutlineStroke = useTransform(lowerRightProgress, [0, 1], [OUTLINE_COLOR, FILL_COLOR]);
  const lowerRightOutlineOpacity = useTransform(lowerRightProgress, [0, 1], [0.55, 1]);

  /* ==========================================================
     RETURN
     ========================================================== */

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 798 712" className="block h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* ==================================================
                  MAIN A CLIP

                  This is now the ONLY boundary required for
                  the Main A fill.

                  The fill can extend beyond the shape safely
                  because SVG clips it here.
                  ================================================== */}

          <clipPath id="a-main-clip">
            <path d={MAIN_A_PATH} />
          </clipPath>

          {/* ==================================================
                  LOWER RIGHT CLIP
                  ================================================== */}

          <clipPath id="a-lower-right-clip">
            <path d={LOWER_RIGHT_PATH} />
          </clipPath>
        </defs>

        {/* ==================================================
                MAIN A OUTLINE
                ================================================== */}

        <motion.path
          d={MAIN_A_PATH}
          style={{
            stroke: mainAOutlineStroke,
            opacity: mainAOutlineOpacity,
          }}
          strokeWidth={1.5}
          fill="none"
        />

        {/* ==================================================
                LOWER RIGHT OUTLINE
                ================================================== */}

        <motion.path
          d={LOWER_RIGHT_PATH}
          style={{
            stroke: lowerRightOutlineStroke,
            opacity: lowerRightOutlineOpacity,
          }}
          strokeWidth={1.5}
          fill="none"
        />

        {/* ==================================================
                MAIN A — LEFT LEG

                NO ARTIFICIAL MASK.

                The actual MAIN_A_PATH clip controls the
                visible boundary.

                This allows the fill to reach the complete
                bottom-left tip and apex.
                ================================================== */}

        <FillLayer clipId="a-main-clip" progress={mainAProgress} geometry={GEOMETRY_MAIN_A_LEFT} rowCount={22} seedBase={100} transform={MAIN_A_LEFT_TRANSFORM} />

        {/* ==================================================
                MAIN A — RIGHT LEG

                SAME ANGLE AS BEFORE.

                The fill is extended enough to reach the
                complete bottom-right tip and apex.
                ================================================== */}

        <FillLayer clipId="a-main-clip" progress={mainAProgress} geometry={GEOMETRY_MAIN_A_RIGHT} rowCount={22} seedBase={500} transform={MAIN_A_RIGHT_TRANSFORM} />

        {/* ==================================================
                LOWER RIGHT
                ================================================== */}

        <FillLayer clipId="a-lower-right-clip" progress={lowerRightProgress} geometry={GEOMETRY_LOWER_RIGHT} rowCount={42} seedBase={200} />
      </svg>
    </div>
  );
};

export default TrionnLogo;
