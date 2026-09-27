// ============================================================
// JOURNEY GEOMETRY
// ============================================================

export const JOURNEY_HEIGHT_VH = 890;

export const JOURNEY_OVERLAP_VH = 50;

export const WIRE_ORIGIN = {
  x: 50.5,
  y: -5.5,
};

export const CONNECTION_OFFSET_Y = 0.1;

// ============================================================
// CONNECTION POINT
// ============================================================

export function getConnectionPoint(point: { x: number; y: number }) {
  return {
    x: point.x,
    y: Math.max(0, point.y - CONNECTION_OFFSET_Y),
  };
}

// ============================================================
// WIRE CURVE
// ============================================================

export function createWireCurve(
  start: {
    x: number;
    y: number;
  },
  end: {
    x: number;
    y: number;
  },
  lane: number,
  variation: number
) {
  const direction = end.x >= start.x ? 1 : -1;

  const horizontalDistance = Math.abs(end.x - start.x);

  const curve = 10 + horizontalDistance * 0.35;

  const laneOffset = lane === 0 ? 0 : lane * (7 + horizontalDistance * 0.16);

  const wave = Math.sin(variation * 1.35 + lane * 1.7) * 14;

  const laneWave = lane * 9.8;

  const c1x = start.x + direction * curve + laneOffset;

  const c1y = start.y + (end.y - start.y) * 0.28 + wave + laneWave;

  const c2x = end.x - direction * curve + laneOffset;

  const c2y = end.y - (end.y - start.y) * 0.28 - wave + laneWave;

  return {
    c1x,
    c1y,
    c2x,
    c2y,
  };
}

// ============================================================
// WIRE PATH
// ============================================================

export function createWirePath(
  start: {
    x: number;
    y: number;
  },
  end: {
    x: number;
    y: number;
  },
  lane: number,
  variation: number
) {
  const { c1x, c1y, c2x, c2y } = createWireCurve(start, end, lane, variation);

  return `
    M ${start.x} ${start.y}
    C
      ${c1x} ${c1y},
      ${c2x} ${c2y},
      ${end.x} ${end.y}
  `;
}
