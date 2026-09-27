'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { Plus } from 'lucide-react';

// ============================================================
// CONFIG
// ============================================================

// Intro timing
const CORNER_TO_CENTER = 0.5;
const CENTER_TO_SQUARE = 0.9;

// Loading
const SQUARE_REVEAL_DELAY = 0.12;
const LOAD_DURATION = 2;
const EXIT_DURATION = 0.85;
const CONTENT_FADE_IN_DURATION = 0.25;
const CONTENT_FADE_OUT_DURATION = 0.4;
const EXIT_START_DELAY = 0.4;

// Easing
const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;
const EASE_LOAD = [0.42, 0, 0.18, 1] as const;
const EASE_BOUNCE = [0.34, 1.6, 0.64, 1] as const;

// Square
const SQUARE_START_SCALE = 0.5;

const SQUARE_SPRING = {
  type: 'spring',
  stiffness: 170,
  damping: 13,
  mass: 0.9,
} as const;

// Layout
const SQUARE_SIZE = '30vmin';
const SQUARE_VMIN = 30;
const PLUS_GAP = 10;

// Counter
const DIGIT_H = 20;
const DIGIT_W = 11;

// Page label
const TEXT_IN_END = 0.3;

// ============================================================
// GEOMETRY
// ============================================================

function getGeo() {
  if (typeof window === 'undefined') {
    return {
      W: 0,
      H: 0,
      half: 0,
    };
  }

  const W = document.documentElement.clientWidth;
  const H = window.innerHeight;

  const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;

  return {
    W,
    H,
    half: (SQUARE_VMIN / 2) * vmin,
  };
}

// ============================================================
// CORNERS
// ============================================================

const CORNERS = [
  {
    id: 'top-left',
    sx: -1,
    sy: -1,
  },
  {
    id: 'top-right',
    sx: 1,
    sy: -1,
  },
  {
    id: 'bottom-left',
    sx: -1,
    sy: 1,
  },
  {
    id: 'bottom-right',
    sx: 1,
    sy: 1,
  },
] as const;

type Corner = (typeof CORNERS)[number];

// ============================================================
// PLUS ROTATION
// ============================================================

const ROTATION_RANGES = [
  [0, 0.25],
  [0.25, 0.5],
  [0.75, 1],
  [0.5, 0.75],
] as const;

// ============================================================
// DIGIT
// ============================================================

function Digit({ value, place }: { value: MotionValue<number>; place: number }) {
  const y = useTransform(value, (v) => -((((v / place) % 10) + 10) % 10) * DIGIT_H);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: DIGIT_H,
        width: DIGIT_W,
      }}
    >
      <motion.div style={{ y }} className="absolute left-0 top-0">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) => (
          <div
            key={i}
            className="flex items-center justify-center tabular-nums"
            style={{
              height: DIGIT_H,
              width: DIGIT_W,
            }}
          >
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ============================================================
// CORNER PLUS
// ============================================================

function CornerPlus({
  corner,
  cornerIndex,
  progress,
  exitProgress,
  onIntroComplete,
  onSquareRevealProgress,
}: {
  corner: Corner;
  cornerIndex: number;
  progress: MotionValue<number>;
  exitProgress: MotionValue<number>;
  onIntroComplete: () => void;
  onSquareRevealProgress?: (value: number) => void;
}) {
  const [rangeStart, rangeEnd] = ROTATION_RANGES[cornerIndex];

  const rotation = useTransform(progress, [rangeStart, rangeEnd], [0, 360], {
    clamp: true,
  });

  // ----------------------------------------------------------
  // INTRO PROGRESS
  // ----------------------------------------------------------

  // a = screen corner -> center
  // b = center -> square corner

  const a = useMotionValue(0);
  const b = useMotionValue(0);

  // ----------------------------------------------------------
  // POSITION
  // ----------------------------------------------------------

  const compute = (axis: 'x' | 'y', av: number, bv: number, ev: number) => {
    const g = getGeo();

    const size = axis === 'x' ? g.W : g.H;
    const s = axis === 'x' ? corner.sx : corner.sy;

    const screen = s > 0 ? size : 0;
    const center = size / 2;

    const square = center + s * (g.half + PLUS_GAP);

    // --------------------------------------------------------
    // EXIT
    // --------------------------------------------------------

    if (ev >= 0) {
      return square * (1 - ev) + screen * ev;
    }

    // --------------------------------------------------------
    // INTRO
    // --------------------------------------------------------

    const mid = screen + (center - screen) * av;

    return mid + (square - mid) * bv;
  };

  const px = useTransform([a, b, exitProgress], (v) => compute('x', v[0] as number, v[1] as number, v[2] as number));

  const py = useTransform([a, b, exitProgress], (v) => compute('y', v[0] as number, v[1] as number, v[2] as number));

  // ----------------------------------------------------------
  // CALLBACK REFS
  // ----------------------------------------------------------

  const introCb = useRef(onIntroComplete);
  introCb.current = onIntroComplete;

  const squareRevealCb = useRef(onSquareRevealProgress);
  squareRevealCb.current = onSquareRevealProgress;

  // ----------------------------------------------------------
  // INTRO ANIMATION
  // ----------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    let c1: ReturnType<typeof animate> | undefined;
    let c2: ReturnType<typeof animate> | undefined;

    const run = async () => {
      // ------------------------------------------------------
      // 1. SCREEN CORNER -> CENTER
      // ------------------------------------------------------

      c1 = animate(a, 1, {
        duration: CORNER_TO_CENTER,
        ease: EASE_IN_OUT,
      });

      await c1;

      if (cancelled) return;

      // ------------------------------------------------------
      // 2. CENTER -> SQUARE CORNER
      // ------------------------------------------------------

      c2 = animate(b, 1, {
        duration: CENTER_TO_SQUARE,
        ease: EASE_BOUNCE,

        onUpdate: (value) => {
          squareRevealCb.current?.(value);
        },
      });

      await c2;

      if (cancelled) return;

      squareRevealCb.current?.(1);
      introCb.current();
    };

    void run();

    return () => {
      cancelled = true;

      c1?.stop();
      c2?.stop();
    };
  }, [a, b]);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <motion.span
      className="pointer-events-none absolute left-0 top-0 z-[70] -ml-[10px] -mt-[10px] flex h-[20px] w-[20px] select-none items-center justify-center text-[#6F6F6F]"
      style={{
        x: px,
        y: py,
        rotate: rotation,
      }}
    >
      <Plus size={16} strokeWidth={2} />
    </motion.span>
  );
}

// ============================================================
// BLACK EXIT
// ============================================================

function BlackExit({ exitProgress }: { exitProgress: MotionValue<number> }) {
  const clipPath = useTransform(exitProgress, (p) => {
    if (p < 0) {
      return 'inset(50% 50% 50% 50%)';
    }

    const g = getGeo();

    const ix = (g.W / 2 - g.half) * (1 - p);
    const iy = (g.H / 2 - g.half) * (1 - p);

    return `inset(${iy}px ${ix}px ${iy}px ${ix}px)`;
  });

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[10] bg-[#050505]"
      style={{
        clipPath,
      }}
    />
  );
}

// ============================================================
// SQUARE BORDER
// ============================================================

const SQUARE_PATH = 'M 0 0 L 100 0 L 100 100 L 0 100 Z';

function SquareBorder({ borderProgress }: { borderProgress: MotionValue<number> }) {
  return (
    <svg className="absolute inset-0 mt-[36px] h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Static dim border */}

      <path d={SQUARE_PATH} fill="none" stroke="#777777" strokeOpacity={0.28} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

      {/* Growing border */}

      <motion.path
        d={SQUARE_PATH}
        fill="none"
        stroke="#4A4A4A"
        strokeWidth={1.5}
        pathLength={1}
        strokeDasharray="1 1"
        style={{
          strokeDashoffset: borderProgress,
        }}
      />
    </svg>
  );
}

// ============================================================
// PAGE LABEL
// ============================================================

function PageLabel({ label, progress }: { label: string; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, TEXT_IN_END], [0, 1], {
    clamp: true,
  });

  return (
    <div className="absolute inset-0 mt-[36px] h-full w-full overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity,
        }}
      >
        <span className="whitespace-nowrap text-[clamp(18px,4vmin,40px)] font-normal uppercase tracking-[0.08em] text-[#252525]">{label}</span>
      </motion.div>
    </div>
  );
}

// ============================================================
// TAGLINE
// ============================================================

function Tagline({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      style={{
        opacity,
      }}
      className="mt-[54px] flex items-center gap-[5px] whitespace-nowrap text-[12px] font-normal tracking-[0.08em] text-[#252525]"
    >
      <span>INSPIRE</span>

      <span className="text-[#777777]">·</span>

      <span>INNOVATE</span>

      <span className="text-[#777777]">·</span>

      <span>IMPACT</span>
    </motion.div>
  );
}

// ============================================================
// COUNTER
// ============================================================

function Counter({ count }: { count: MotionValue<number> }) {
  return (
    <div className="absolute bottom-[12%] flex text-[11px] font-light leading-none text-[#303030]">
      <Digit value={count} place={100} />
      <Digit value={count} place={10} />
      <Digit value={count} place={1} />
    </div>
  );
}

// ============================================================
// PAGE LOADER
// ============================================================

type PageLoaderProps = {
  label: string;
  onComplete: () => void;
};

export function PageLoader({ label, onComplete }: PageLoaderProps) {
  // ----------------------------------------------------------
  // MOTION VALUES
  // ----------------------------------------------------------

  const progress = useMotionValue(0);

  const exitProgress = useMotionValue(-1);

  const contentOpacity = useMotionValue(1);

  const contentScale = useMotionValue(SQUARE_START_SCALE);

  const squareRevealProgress = useMotionValue(0);

  // ----------------------------------------------------------
  // NORMAL LOADER VALUES
  // ----------------------------------------------------------

  const count = useTransform(progress, [0, 1], [0, 100]);

  const taglineOpacity = useTransform(progress, [0.15, 0.4], [0, 1]);

  const borderProgress = useTransform(progress, [0, 1], [1, 0]);

  // ----------------------------------------------------------
  // INTRO SQUARE
  // ----------------------------------------------------------

  const introSquareScale = useTransform(squareRevealProgress, [0, 0.5, 1], [SQUARE_START_SCALE, SQUARE_START_SCALE, 1]);

  const introSquareOpacity = useTransform(squareRevealProgress, [0, 0.5], [0, 1]);

  const squareOpacity = useTransform([introSquareOpacity, contentOpacity], (v) => (v[0] as number) * (v[1] as number));

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [removed, setRemoved] = useState(false);

  const completedCorners = useRef(0);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ----------------------------------------------------------
  // CALLBACK REF
  // ----------------------------------------------------------

  const completeCb = useRef(onComplete);
  completeCb.current = onComplete;

  // ----------------------------------------------------------
  // EXIT
  // ----------------------------------------------------------

  const startExit = useCallback(() => {
    // --------------------------------------------------------
    // 1. Square disappears first
    // --------------------------------------------------------

    animate(contentOpacity, 0, {
      duration: CONTENT_FADE_OUT_DURATION,
      ease: 'easeOut',
    });

    // --------------------------------------------------------
    // 2. Black exit + plus icons
    // --------------------------------------------------------

    const exitStartTimer = setTimeout(() => {
      exitProgress.set(0);

      animate(exitProgress, 1, {
        duration: EXIT_DURATION,
        ease: EASE_IN_OUT,
      });
    }, EXIT_START_DELAY * 1000);

    // --------------------------------------------------------
    // 3. Remove loader
    // --------------------------------------------------------

    const exitTimer = setTimeout(
      () => {
        setRemoved(true);
        completeCb.current();
      },
      (EXIT_START_DELAY + EXIT_DURATION) * 1000
    );

    timers.current.push(exitStartTimer, exitTimer);
  }, [contentOpacity, exitProgress]);

  // ----------------------------------------------------------
  // START LOADING
  // ----------------------------------------------------------

  const startLoading = useCallback(() => {
    animate(contentOpacity, 1, {
      duration: CONTENT_FADE_IN_DURATION,
    });

    animate(contentScale, 1, SQUARE_SPRING);

    animate(progress, 1, {
      duration: LOAD_DURATION,
      ease: EASE_LOAD,
      onComplete: startExit,
    });
  }, [contentOpacity, contentScale, progress, startExit]);

  // ----------------------------------------------------------
  // ALL FOUR PLUS MOVEMENTS COMPLETE
  // ----------------------------------------------------------

  const handlePlusComplete = useCallback(() => {
    completedCorners.current += 1;

    if (completedCorners.current !== CORNERS.length) {
      return;
    }

    const revealTimer = setTimeout(startLoading, SQUARE_REVEAL_DELAY * 1000);

    timers.current.push(revealTimer);
  }, [startLoading]);

  // ----------------------------------------------------------
  // CLEANUP
  // ----------------------------------------------------------

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  // ----------------------------------------------------------
  // REMOVED
  // ----------------------------------------------------------

  if (removed) {
    return null;
  }

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[#C8C8C8]">
      {/* ======================================================
          BLACK EXIT
          ====================================================== */}

      <BlackExit exitProgress={exitProgress} />

      {/* ======================================================
          FOUR PLUS ICONS
          ====================================================== */}

      {CORNERS.map((corner, index) => (
        <CornerPlus
          key={corner.id}
          corner={corner}
          cornerIndex={index}
          progress={progress}
          exitProgress={exitProgress}
          onIntroComplete={handlePlusComplete}
          onSquareRevealProgress={
            index === 0
              ? (value) => {
                  squareRevealProgress.set(value);
                }
              : undefined
          }
        />
      ))}

      {/* ======================================================
          EXISTING SQUARE / PAGE LOADER CONTENT
          ====================================================== */}

      <motion.div
        style={{
          opacity: squareOpacity,
          scale: introSquareScale,
        }}
        className="relative z-[50] flex h-full w-full flex-col items-center justify-center text-[#303030]"
      >
        {/* ====================================================
            EXISTING SQUARE
            ==================================================== */}

        <div
          className="relative aspect-square"
          style={{
            width: SQUARE_SIZE,
          }}
        >
          <SquareBorder borderProgress={borderProgress} />

          <PageLabel label={label} progress={progress} />
        </div>

        {/* ====================================================
            TAGLINE
            ==================================================== */}

        <Tagline opacity={taglineOpacity} />

        {/* ====================================================
            COUNTER
            ==================================================== */}

        <Counter count={count} />
      </motion.div>
    </div>
  );
}

// ============================================================
// PROVIDER + HOOK
// ============================================================

type Transition = {
  to: string;
  label: string;
};

const PageTransitionContext = createContext<(to: string, label: string) => void>(() => {});

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [transition, setTransition] = useState<Transition | null>(null);

  const go = useCallback(
    (to: string, label: string) => {
      if (transition) {
        return;
      }

      if (to === window.location.pathname) {
        return;
      }

      setTransition({
        to,
        label,
      });
    },
    [transition]
  );

  return (
    <PageTransitionContext.Provider value={go}>
      {children}

      {transition && (
        <PageLoader
          key={transition.to}
          label={transition.label}
          onComplete={() => {
            navigate(transition.to);
            window.scrollTo(0, 0);
            setTransition(null);
          }}
        />
      )}
    </PageTransitionContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export const usePageTransition = () => useContext(PageTransitionContext);
