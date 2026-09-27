'use client';

import { useMemo } from 'react';

import { useTransform } from 'framer-motion';

import { createWirePath } from '@/utils/journey';

import { WireLine } from './WireLine';

type Point = {
  x: number;
  y: number;
};

type WireSegmentProps = {
  start: Point;
  end: Point;
  progressStart: number;
  progressEnd: number;
  segmentIndex: number;
  journeyProgress: any;
};

export function WireSegment({ start, end, progressStart, progressEnd, segmentIndex, journeyProgress }: WireSegmentProps) {
  const drawProgress = useTransform(journeyProgress, [progressStart, progressEnd], [0, 1], {
    clamp: true,
  });

  const wires = useMemo(() => {
    return [-1, 0, 1].map((lane) => ({
      lane,
      path: createWirePath(start, end, lane, segmentIndex * 3),
    }));
  }, [start, end, segmentIndex]);

  return (
    <g>
      {wires.map((wire) => (
        <WireLine key={`wire-${segmentIndex}-${wire.lane}`} start={start} end={end} lane={wire.lane} variation={segmentIndex * 3} drawProgress={drawProgress} />
      ))}
    </g>
  );
}
