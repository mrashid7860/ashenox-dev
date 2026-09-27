'use client';
import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
type Point = {
  x: number;
  y: number;
};

type WireLineProps = {
  start: Point;
  end: Point;
  lane: number;
  variation: number;
  drawProgress: any;
};

export function WireLine({ start, end, lane, variation, drawProgress }: WireLineProps) {
  const pathRef = useRef<SVGPathElement | null>(null);

  const waveX = useMotionValue(0);
  const waveY = useMotionValue(0);

  const dotX = useMotionValue(start.x);
  const dotY = useMotionValue(start.y);

  useAnimationFrame((time) => {
    const seconds = time / 1000;

    waveX.set(Math.sin(seconds * 0.8 + variation * 1.3 + lane * 0.8) * 5);

    waveY.set(Math.sin(seconds * 1.05 + variation * 1.1 + lane * 1.4) * 12);
  });

  const direction = end.x >= start.x ? 1 : -1;

  const horizontalDistance = Math.abs(end.x - start.x);

  const curve = 10 + horizontalDistance * 0.35;

  const laneCurve = lane === 0 ? 0 : lane * (7 + horizontalDistance * 0.16);

  const laneWave = lane * 2.8;

  const animatedPath = useTransform([waveX, waveY], ([currentX, currentY]) => {
    const c1x = start.x + direction * curve + laneCurve + (currentX as number);

    const c1y = start.y + (end.y - start.y) * 0.28 + (currentY as number) + laneWave;

    const c2x = end.x - direction * curve + laneCurve - (currentX as number);

    const c2y = end.y - (end.y - start.y) * 0.28 - (currentY as number) + laneWave;

    return `
        M ${start.x} ${start.y}
        C
          ${c1x} ${c1y},
          ${c2x} ${c2y},
          ${end.x} ${end.y}
      `;
  });

  useAnimationFrame(() => {
    const path = pathRef.current;

    if (!path) return;

    const length = path.getTotalLength();

    if (!length) return;

    const progress = Math.max(0, Math.min(1, drawProgress.get()));

    const point = path.getPointAtLength(length * progress);

    dotX.set(point.x);
    dotY.set(point.y);
  });

  const dotOpacity = useTransform(drawProgress, [0, 0.005, 1], [0, 1, 1], {
    clamp: true,
  });

  return (
    <g>
      <motion.path
        d={animatedPath}
        fill="none"
        stroke="rgba(238, 238, 243, 0.12)"
        strokeWidth="0"
        strokeLinecap="round"
        pathLength={1}
        style={{
          pathLength: drawProgress,
        }}
      />

      <motion.path
        ref={pathRef}
        d={animatedPath}
        fill="none"
        stroke="rgba(102, 103, 104, 0.48)"
        strokeWidth="0.1"
        strokeLinecap="round"
        pathLength={1}
        style={{
          pathLength: drawProgress,
        }}
      />

      <motion.circle
        cx={dotX}
        cy={dotY}
        r="0.15"
        fill="rgba(255,255,255,0.98)"
        style={{
          opacity: dotOpacity,
        }}
      />
    </g>
  );
}
