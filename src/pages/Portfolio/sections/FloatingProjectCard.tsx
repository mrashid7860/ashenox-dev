'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { MotionValue } from 'framer-motion';

import {
  BATCH_DURATION,
  BATCH_START,
  BATCH_STEP,
  BATCH_SIZES,
  MOBILE_BATCH_DURATION,
  MOBILE_BATCH_START,
  MOBILE_BATCH_STEP,
  MOBILE_BATCH_SIZES,
  DEFAULT_FLOATING_CONFIG,
  MOBILE_FLOATING_CONFIG,
  getBatchIndex,
  createFloatingMotion,
  easeOutCubic,
  smoothstep,
} from '@/utils/floatingMotion';

import type { FloatingMotionConfig } from '@/utils/floatingMotion';

import { FloatingMotionDevPanel } from '@/pages/Portfolio/sections/FloatingMotionDevPanel';

/* ============================================================
   SHARED CONFIG
============================================================ */

let sharedConfig: FloatingMotionConfig = DEFAULT_FLOATING_CONFIG;

const listeners = new Set<(config: FloatingMotionConfig) => void>();

function setSharedConfig(next: FloatingMotionConfig) {
  sharedConfig = next;

  listeners.forEach((listener) => {
    listener(next);
  });
}

type FloatingProjectCardProps = {
  image: string;
  index: number;
  scrollYProgress: MotionValue<number>;
  config?: FloatingMotionConfig;
};

export function FloatingProjectCard({ image, index, scrollYProgress, config: configProp }: FloatingProjectCardProps) {
  /* ==========================================================
     MOBILE DETECTION
  ========================================================== */

  const [isMobile, setIsMobile] = useState(false);

  const [viewportWidth, setViewportWidth] = useState(390);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');

    const update = () => {
      setIsMobile(media.matches);

      setViewportWidth(window.visualViewport?.width ?? window.innerWidth);
    };

    update();

    media.addEventListener('change', update);

    window.visualViewport?.addEventListener('resize', update);

    window.addEventListener('resize', update);

    return () => {
      media.removeEventListener('change', update);

      window.visualViewport?.removeEventListener('resize', update);

      window.removeEventListener('resize', update);
    };
  }, []);

  /* ==========================================================
     CONFIG
  ========================================================== */

  const [liveConfig, setLiveConfig] = useState<FloatingMotionConfig>(configProp ?? (isMobile ? MOBILE_FLOATING_CONFIG : sharedConfig));

  useEffect(() => {
    const listener = (next: FloatingMotionConfig) => {
      setLiveConfig(next);
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const config = isMobile ? MOBILE_FLOATING_CONFIG : liveConfig;

  /* ==========================================================
     RANDOM MOTION
  ========================================================== */

  const motionData = useMemo(() => createFloatingMotion(index, config), [index, config]);

  const floatingProgress = useMotionValue(0);

  /* ==========================================================
     MOUNT TIME
  ========================================================== */

  const mountTimeRef = useRef<number | null>(null);

  if (mountTimeRef.current === null) {
    mountTimeRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  /* ==========================================================
     SLOT
  ========================================================== */

  const { blinkCount, slots } = motionData;

  const slotLength = 1 / blinkCount;

  function getSlot(p: number) {
    const clamped = Math.min(0.999999, Math.max(0, p));

    const i = Math.min(blinkCount - 1, Math.floor(clamped / slotLength));

    const localT = (clamped - i * slotLength) / slotLength;

    return {
      slot: slots[i],
      localT,
    };
  }

  /* ==========================================================
     OPACITY
  ========================================================== */

  const floatingOpacity = useTransform(floatingProgress, (value) => {
    const elapsedMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - (mountTimeRef.current ?? 0);

    if (elapsedMs < config.INITIAL_HOLD_SECONDS * 1000) {
      return 1;
    }

    const { localT } = getSlot(value);

    if (localT < config.FADE_FRACTION) {
      return smoothstep(localT / config.FADE_FRACTION);
    }

    if (localT < config.FADE_FRACTION + config.HOLD_FRACTION) {
      return 1;
    }

    const fadeOutEnd = config.FADE_FRACTION * 2 + config.HOLD_FRACTION;

    if (localT < fadeOutEnd) {
      return 1 - smoothstep((localT - (config.FADE_FRACTION + config.HOLD_FRACTION)) / config.FADE_FRACTION);
    }

    return 0;
  });

  /* ==========================================================
     RANDOM X
  ========================================================== */

  const floatingX = useTransform(floatingProgress, (value) => {
    const { slot, localT } = getSlot(value);

    const fadeOutEnd = config.FADE_FRACTION * 2 + config.HOLD_FRACTION;

    const pathT = smoothstep(Math.min(1, localT / fadeOutEnd));

    return slot.x + slot.driftX * pathT;
  });

  /* ==========================================================
     RANDOM Y
  ========================================================== */

  const floatingY = useTransform(floatingProgress, (value) => {
    const { slot, localT } = getSlot(value);

    const fadeOutEnd = config.FADE_FRACTION * 2 + config.HOLD_FRACTION;

    const pathT = smoothstep(Math.min(1, localT / fadeOutEnd));

    return slot.y + slot.driftY * pathT;
  });

  /* ==========================================================
     ROTATION
  ========================================================== */

  const floatingRotate = useTransform(floatingProgress, (value) => getSlot(value).slot.rotate);

  /* ==========================================================
     SCALE
  ========================================================== */

  const floatingScale = useTransform(floatingProgress, (value) => getSlot(value).slot.scale);

  /* ==========================================================
     RESPONSIVE CARD WIDTH
  ========================================================== */

  const floatingWidth = useTransform(floatingProgress, (value) => {
    const randomWidth = getSlot(value).slot.width;

    if (!isMobile) {
      return `${randomWidth}px`;
    }

    /*
     * Base width is designed around
     * a 390px phone.
     *
     * This scales naturally with
     * the actual mobile viewport.
     */

    const viewportScale = viewportWidth / 390;

    const scaledWidth = randomWidth * viewportScale;

    /*
     * Keep enough room around
     * the card on narrow phones.
     */

    const maxWidth = viewportWidth * 0.46;

    const minWidth = viewportWidth * 0.28;

    const finalWidth = Math.min(maxWidth, Math.max(minWidth, scaledWidth));

    return `${finalWidth}px`;
  });

  const floatingAspect = useTransform(floatingProgress, (value) => getSlot(value).slot.aspect);

  /* ==========================================================
     CONTINUOUS BLINK LOOP
  ========================================================== */

  useEffect(() => {
    const controls = animate(floatingProgress, 1, {
      duration: motionData.duration,

      delay: motionData.delay,

      repeat: Infinity,

      repeatType: 'loop',

      ease: 'linear',
    });

    return () => {
      controls.stop();
    };
  }, [floatingProgress, motionData]);

  /* ==========================================================
     MAGNETIC BATCH
  ========================================================== */

  const batchSizes = isMobile ? MOBILE_BATCH_SIZES : BATCH_SIZES;

  const batchIndex = getBatchIndex(index, batchSizes);

  const batchStart = isMobile ? MOBILE_BATCH_START + batchIndex * MOBILE_BATCH_STEP : BATCH_START + batchIndex * BATCH_STEP;

  const batchEnd = batchStart + (isMobile ? MOBILE_BATCH_DURATION : BATCH_DURATION);

  const attractProgress = useTransform(scrollYProgress, [batchStart, batchEnd], [0, 1], {
    clamp: true,
  });

  /* ==========================================================
     MAGNETIC EASING
  ========================================================== */

  const magneticProgress = useTransform(attractProgress, easeOutCubic);

  /* ==========================================================
     MAGNETIC X
  ========================================================== */

  const x = useTransform([floatingX, magneticProgress], ([currentX, progress]) => {
    const fx = currentX as number;

    const p = progress as number;

    /*
     * Mobile gets slightly reduced
     * travel so cards stay inside
     * the viewport.
     */

    const travelMultiplier = isMobile ? 0.92 : 1;

    return `${fx * travelMultiplier * (1 - p)}vw`;
  });

  /* ==========================================================
     MAGNETIC Y
  ========================================================== */

  const y = useTransform([floatingY, magneticProgress], ([currentY, progress]) => {
    const fy = currentY as number;

    const p = progress as number;

    /*
     * Mobile movement is based on
     * viewport height, not pixels.
     */

    const travelMultiplier = isMobile ? 0.9 : 1;

    return `${fy * travelMultiplier * (1 - p)}vh`;
  });

  /* ==========================================================
     ROTATION
  ========================================================== */

  const rotate = useTransform([floatingRotate, magneticProgress], ([currentRotate, progress]) => {
    const r = currentRotate as number;

    const p = progress as number;

    return r * (1 - p);
  });

  /* ==========================================================
     MOBILE MAGNETIC SCALE
  ========================================================== */

  const magneticScale = useTransform(
    attractProgress,
    isMobile ? [0, 0.18, 0.38, 0.58, 0.76, 0.9, 1] : [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1],
    isMobile ? [1, 0.94, 0.78, 0.58, 0.35, 0.12, 0.02] : [1, 0.94, 0.78, 0.58, 0.35, 0.12, 0.02]
  );

  /* ==========================================================
     COMBINED SCALE
  ========================================================== */

  const combinedScale = useTransform([floatingScale, magneticScale], ([randomScale, magnetScale]) => {
    return (randomScale as number) * (magnetScale as number);
  });

  /* ==========================================================
     SCROLL VISIBILITY
  ========================================================== */

  const scrollVisibility = useTransform(attractProgress, (progress) => {
    if (progress < 0.94) {
      return 1;
    }

    return 1 - (progress - 0.94) / 0.06;
  });

  /* ==========================================================
     COMBINED OPACITY
  ========================================================== */

  const combinedOpacity = useTransform([floatingOpacity, scrollVisibility], ([randomVisibility, scrollVisibilityValue]) => {
    return (randomVisibility as number) * (scrollVisibilityValue as number);
  });

  /* ==========================================================
     Z INDEX
  ========================================================== */

  const zIndex = useTransform(attractProgress, [0, 0.5, 0.8, 1], [5, 10, 20, 30]);

  /* ==========================================================
     RETURN
  ========================================================== */

  return (
    <>
      {/* DEV PANEL */}

      {/* 
      {index === 0 &&
        process.env.NODE_ENV !==
          'production' && (
          <FloatingMotionDevPanel
            config={config}
            onChange={
              setSharedConfig
            }
          />
        )}
      */}

      <motion.div
        aria-label="View project"
        style={{
          x,
          y,
          rotate,
          scale: combinedScale,
          opacity: combinedOpacity,
          zIndex,

          width: floatingWidth,

          aspectRatio: floatingAspect,

          minWidth: floatingWidth,

          maxWidth: floatingWidth,
        }}
        className="pointer-events-auto absolute left-[48%] top-[40%] block overflow-hidden rounded-[6px] bg-white/[0.03] shadow-[0_15px_50px_rgba(0,0,0,0.35)] will-change-transform md:left-[48%] md:top-[40%]"
      >
        <div className="relative h-full w-full overflow-hidden">
          <img src={image} alt="" draggable={false} loading="lazy" className="block h-full w-full select-none object-cover" />

          <div className="pointer-events-none absolute inset-0 bg-black/[0.04]" />
        </div>
      </motion.div>
    </>
  );
}

export default FloatingProjectCard;
