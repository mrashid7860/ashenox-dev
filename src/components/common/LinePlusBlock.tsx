'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

type LinePlusBlockProps = {
  className?: string;

  // Line
  lineColor?: string;
  lineOpacity?: number;
  lineHeight?: number;
  lineWidth?: string;
  lineOrigin?: 'center' | 'left' | 'right';

  // Plus
  showPlus?: boolean;
  plusPosition?: string;
  plusSize?: number;
  plusStrokeWidth?: number;
  plusColor?: string;
  plusOpacity?: number;
  plusTop?: string;

  // Scroll
  scrollStart?: string;
  scrollEnd?: string;

  // Rotation
  rotateFrom?: number;
  rotateTo?: number;

  // Plus opacity timing
  plusOpacityStart?: number;
  plusOpacityEnd?: number;
};

export function LinePlusBlock({
  className = '',

  // Line defaults
  lineColor = '#D8D8D8',
  lineOpacity = 0.2,
  lineHeight = 1,
  lineWidth = '100%',
  lineOrigin = 'center',

  // Plus defaults
  showPlus = true,
  plusPosition = '50%',
  plusSize = 14,
  plusStrokeWidth = 2.5,
  plusColor = '#D8D8D8',
  plusOpacity = 0.7,
  plusTop = '50%',

  // Scroll defaults
  scrollStart = 'start 100%',
  scrollEnd = 'start 40%',

  // Rotation defaults
  rotateFrom = 0,
  rotateTo = 360,

  // Opacity timing
  plusOpacityStart = 0,
  plusOpacityEnd = 0.05,
}: LinePlusBlockProps) {
  const lineRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: [scrollStart, scrollEnd],
  });

  /*
   * LINE
   *
   * 0 → 1
   *
   * scaleX grows from the selected origin.
   */
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /*
   * PLUS ROTATION
   *
   * 0 → 360
   */
  const plusRotate = useTransform(scrollYProgress, [0, 1], [rotateFrom, rotateTo]);

  /*
   * PLUS OPACITY
   */
  const plusScrollOpacity = useTransform(scrollYProgress, [plusOpacityStart, plusOpacityEnd], [0, plusOpacity]);

  const transformOrigin = lineOrigin === 'center' ? 'center center' : lineOrigin === 'left' ? 'left center' : 'right center';

  return (
    <div ref={lineRef} className={`relative h-[20px] w-full ${className}`}>
      {/* LINE */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2"
        style={{
          width: lineWidth,
          height: lineHeight,
          backgroundColor: lineColor,
          opacity: lineOpacity,
          scaleX: lineScale,
          transformOrigin,
        }}
      />

      {/* PLUS */}
      {showPlus && (
        <motion.div
          className="absolute z-20 flex h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{
            left: plusPosition,
            top: plusTop,
            rotate: plusRotate,
            opacity: plusScrollOpacity,
          }}
        >
          <Plus size={plusSize} strokeWidth={plusStrokeWidth} color={plusColor} />
        </motion.div>
      )}
    </div>
  );
}
