'use client';

import { motion, useTransform } from 'framer-motion';

type JourneyConnectionPointProps = {
  x: number;
  y: number;
  progress: number;
  journeyProgress: any;
};

export function JourneyConnectionPoint({ x, y, progress, journeyProgress }: JourneyConnectionPointProps) {
  const opacity = useTransform(journeyProgress, [progress - 0.015, progress, progress + 0.035], [0, 1, 0.9], {
    clamp: true,
  });

  return (
    <motion.circle
      cx={x}
      cy={y}
      r="0.1"
      fill="rgba(255,255,255,0.96)"
      style={{
        opacity,
      }}
    />
  );
}
