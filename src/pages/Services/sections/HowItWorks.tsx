'use client';

import { useRef } from 'react';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

import { Plus } from 'lucide-react';

import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { processSteps, type ProcessStep } from '@/data/process.data';

/* ============================================================
   CONSTANTS
============================================================ */

const ease = [0.16, 1, 0.3, 1] as const;

/* ============================================================
   TYPES
============================================================ */

type HowItWorksProps = {
  theme?: 'light' | 'dark';
  mobileSticky?: boolean;
  mobileHeight?: string;
};

type ProcessStepProps = {
  step: ProcessStep;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  colors: ReturnType<typeof getColors>;
  className?: string;
};

type MobileProcessStepProps = {
  step: ProcessStep;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  line: MotionValue<string>;
  colors: ReturnType<typeof getColors>;
  isLastStep?: boolean;
};

/* ============================================================
   THEME
============================================================ */

function getColors(isDark: boolean) {
  return {
    background: isDark ? 'bg-[#050609]' : 'bg-white',
    primary: isDark ? 'text-white' : 'text-[#444444]',
    secondary: isDark ? 'text-white/35' : 'text-black/35',
    muted: isDark ? 'text-white/80' : 'text-[#444444]',
    line: isDark ? 'bg-white/20' : 'bg-black/20',
    activeLine: isDark ? 'bg-white/30' : 'bg-black/30',
    plus: isDark ? 'text-white' : 'text-[#444444]',
    plusLine: isDark ? 'bg-white/80' : 'bg-black/80',
    topBorder: isDark ? 'bg-white/10' : 'bg-[#444]/10',
  };
}

/* ============================================================
   DESKTOP PROCESS STEP
============================================================ */

function ProcessStepContent({ step, opacity, y, colors, className = '' }: ProcessStepProps) {
  const numberOpacity = useTransform(opacity, [0, 0.2], [0, 1]);
  const titleOpacity = useTransform(opacity, [0.2, 0.5], [0, 1]);
  const descriptionOpacity = useTransform(opacity, [0.5, 1], [0, 1]);

  return (
    <motion.div className={className}>
      {/* NUMBER */}
      <motion.div
        style={{
          opacity: numberOpacity,
          y,
        }}
        className={`text-[13px] font-light leading-none tracking-[-0.025em] ${colors.muted}`}
      >
        {step.number}
      </motion.div>

      {/* TITLE */}
      <motion.h3
        style={{
          opacity: titleOpacity,
          y,
        }}
        className={`mt-[30px] text-[30px] font-normal leading-[1] tracking-[-0.055em] sm:text-[32px] lg:text-[28px] ${colors.primary}`}
      >
        {step.title}
      </motion.h3>

      {/* DESCRIPTION */}
      <motion.p
        style={{
          opacity: descriptionOpacity,
          y,
        }}
        className={`mt-[25px] text-[14px] font-normal leading-[1.25] tracking-[-0.02em] ${colors.secondary}`}
      >
        {step.description}
      </motion.p>
    </motion.div>
  );
}
/* ============================================================
   MOBILE PROCESS STEP
============================================================ */

function MobileProcessStep({ step, opacity, y, line, colors, isLastStep = false }: MobileProcessStepProps) {
  return (
    <div className={`relative ${isLastStep ? '' : 'pb-6'}`}>
      {/* STEP CONTENT */}

      <motion.div
        style={{
          opacity,
          y,
        }}
        className="mb-2 mt-2 grid grid-cols-[85px_minmax(0,1fr)] pr-5"
      >
        {/* NUMBER */}

        <div className={`pt-[2px] text-[12px] font-light leading-none tracking-[-0.025em] ${colors.muted}`}>{step.number}</div>

        {/* CONTENT */}

        <div>
          <h3 className={`m-0 text-[20px] font-normal leading-[0.95] tracking-[-0.055em] ${colors.primary}`}>{step.title}</h3>

          <p className={`mt-3 max-w-[320px] text-[14px] font-normal leading-[1.25] tracking-[-0.02em] ${colors.secondary}`}>{step.description}</p>
        </div>
      </motion.div>

      {/* LINE */}

      <div className={`relative mt-8 w-full overflow-hidden ${isLastStep ? 'h-[1px]' : 'h-[1.2px]'}`}>
        <motion.div
          style={{
            width: line,
          }}
          className={`absolute left-0 top-0 h-full ${colors.activeLine}`}
        />
      </div>
    </div>
  );
}

/* ============================================================
   TIMELINE PLUS
============================================================ */

function TimelinePlus({ left, opacity, colors, size = 20 }: { left?: string; opacity?: MotionValue<number>; colors: ReturnType<typeof getColors>; size?: number }) {
  const content = <Plus size={size} strokeWidth={1.2} />;

  if (opacity) {
    return (
      <motion.div
        style={{
          left,
          opacity,
        }}
        className={`absolute top-1/2 z-20 h-[12px] w-[13px] -translate-x-1/2 -translate-y-1/2 ${colors.plus}`}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={`absolute left-0 top-1/2 z-20 h-[12px] w-[13px] -translate-x-1/2 -translate-y-1/2 ${colors.plus}`}>{content}</div>;
}

/* ============================================================
   MOVING PLUS
============================================================ */

function MovingPlus({ left, rotate, opacity, colors }: { left: MotionValue<string>; rotate: MotionValue<number>; opacity: MotionValue<number>; colors: ReturnType<typeof getColors> }) {
  return (
    <motion.div
      style={{
        left,
        rotate,
        opacity,
      }}
      className="absolute top-[-1px] z-30 ml-[-2.5px] h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2"
    >
      <span className={`absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 ${colors.plusLine}`} />

      <span className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 ${colors.plusLine}`} />
    </motion.div>
  );
}

/* ============================================================
   HOW IT WORKS
============================================================ */

function HowItWorks({ theme = 'light', mobileSticky = true, mobileHeight = '300vh' }: HowItWorksProps) {
  /*
   * animationRef = only the animation area
   *
   * holdRef = complete How It Works section
   */

  const animationRef = useRef<HTMLElement | null>(null);
  const holdRef = useRef<HTMLElement | null>(null);

  const isDark = theme === 'dark';

  const colors = getColors(isDark);

  /* =========================================================
     DESKTOP SCROLL PROGRESS
  ========================================================= */

  const { scrollYProgress } = useScroll({
    target: animationRef,
    offset: ['start 70%', 'end start'],
  });

  /* =========================================================
     DESKTOP HEADER
  ========================================================= */

  // const headingOpacity = useTransform(scrollYProgress, [0, 0.04, 0.95, 1], [0.5, 1, 1, 0.85]);

  /* =========================================================
     DESKTOP STEP 1
  ========================================================= */

  const step1Opacity = useTransform(scrollYProgress, [0.04, 0.18], [0, 1]);

  const step1Y = useTransform(scrollYProgress, [0.04, 0.18], [40, 0]);

  /* =========================================================
     DESKTOP STEP 2
  ========================================================= */

  const step2Opacity = useTransform(scrollYProgress, [0.39, 0.5], [0, 1]);

  const step2Y = useTransform(scrollYProgress, [0.39, 0.5], [35, 0]);

  /* =========================================================
     DESKTOP STEP 3
  ========================================================= */

  const step3Opacity = useTransform(scrollYProgress, [0.64, 0.76], [0, 1]);

  const step3Y = useTransform(scrollYProgress, [0.64, 0.76], [35, 0]);

  /* =========================================================
     DESKTOP CONTINUOUS LINE
  ========================================================= */

  const growingLineWidth = useTransform(scrollYProgress, [0.04, 0.38, 0.63, 0.82], ['0%', '37%', '71%', '100%']);

  const plus2Opacity = useTransform(scrollYProgress, [0.379, 0.38], [0, 1]);

  const plus3Opacity = useTransform(scrollYProgress, [0.629, 0.63], [0, 1]);

  const plus4Opacity = useTransform(scrollYProgress, [0.819, 0.82], [0, 1]);

  const movingPlusRotate = useTransform(scrollYProgress, [0.14, 0.38, 0.62, 0.83], [0, 360, 720, 900]);

  const movingPlusOpacity = useTransform(scrollYProgress, [0.14, 0.36, 0.38, 0.4, 0.6, 0.62, 0.64, 0.88, 0.899, 0.9], [1, 1, 0, 1, 1, 0, 1, 1, 1, 0]);

  /* =========================================================
     MOBILE CARD REFS
  ========================================================= */

  const mobileStep1Ref = useRef<HTMLDivElement | null>(null);
  const mobileStep2Ref = useRef<HTMLDivElement | null>(null);
  const mobileStep3Ref = useRef<HTMLDivElement | null>(null);

  const mobileStepRefs = [mobileStep1Ref, mobileStep2Ref, mobileStep3Ref];

  /* =========================================================
     MOBILE CARD 1
  ========================================================= */

  const { scrollYProgress: mobileStep1Progress } = useScroll({
    target: mobileStep1Ref,
    offset: ['start 90%', 'end 55%'],
  });

  const mobileStep1Opacity = useTransform(mobileStep1Progress, [0, 0.35], [0, 1]);

  const mobileStep1Y = useTransform(mobileStep1Progress, [0, 0.35], [35, 0]);

  const mobileLine1 = useTransform(mobileStep1Progress, [0.15, 0.5], ['0%', '100%']);

  /* =========================================================
     MOBILE CARD 2
  ========================================================= */

  const { scrollYProgress: mobileStep2Progress } = useScroll({
    target: mobileStep2Ref,
    offset: ['start 90%', 'end 55%'],
  });

  const mobileStep2Opacity = useTransform(mobileStep2Progress, [0, 0.35], [0, 1]);

  const mobileStep2Y = useTransform(mobileStep2Progress, [0, 0.35], [35, 0]);

  const mobileLine2 = useTransform(mobileStep2Progress, [0.15, 0.5], ['0%', '100%']);

  /* =========================================================
     MOBILE CARD 3
  ========================================================= */

  const { scrollYProgress: mobileStep3Progress } = useScroll({
    target: mobileStep3Ref,
    offset: ['start 90%', 'end 78%'],
  });

  const mobileStep3Opacity = useTransform(mobileStep3Progress, [0, 0.35], [0, 1]);

  const mobileStep3Y = useTransform(mobileStep3Progress, [0, 0.35], [35, 0]);

  const mobileLine3 = useTransform(mobileStep3Progress, [0.15, 0.5], ['0%', '100%']);

  const mobileStepOpacities = [mobileStep1Opacity, mobileStep2Opacity, mobileStep3Opacity];

  const mobileStepYs = [mobileStep1Y, mobileStep2Y, mobileStep3Y];

  const mobileLines = [mobileLine1, mobileLine2, mobileLine3];

  return (
    <section ref={holdRef} className={`relative w-full ${colors.background} ${colors.primary}`}>
      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="block md:hidden">
        <div className="relative w-full" style={{ height: mobileSticky ? mobileHeight : 'auto' }}>
          <div className={mobileSticky ? 'sticky top-0 h-screen w-full overflow-hidden' : 'relative w-full'}>
            <div className="relative h-full w-full">
              {/* MOBILE HEADER */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.7,
                  ease,
                }}
                className="absolute left-0 top-0 z-20 w-full px-5 pt-[12vh] text-left"
              >
                <div className={`text-left text-[13px] font-normal leading-none tracking-[-0.025em] ${colors.muted}`}>OUR PROCESS</div>

                <h2 className={`mt-5 text-left text-[clamp(2rem,1vw,1rem)] font-light leading-[0.88] tracking-[-0.075em] md:text-[clamp(3rem,13vw,5rem)] ${colors.primary}`}>How we work</h2>

                <p className={`mt-[15px] max-w-[380px] text-[14px] leading-[1.2] tracking-[-0.025em] md:mt-[18px] ${colors.secondary}`}>
                  A repeatable method applied
                  <br />
                  across every engagement.
                </p>
              </motion.div>

              {/* MOBILE PROCESS */}

              <div className="absolute left-0 top-[30%] w-full px-5">
                {processSteps.map((step, index) => (
                  <div key={step.number} ref={mobileStepRefs[index]}>
                    <MobileProcessStep
                      step={step}
                      opacity={mobileStepOpacities[index]}
                      y={mobileStepYs[index]}
                      line={mobileLines[index]}
                      colors={colors}
                      isLastStep={index === processSteps.length - 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLET + DESKTOP
      ===================================================== */}

      <div className="hidden md:block">
        <section ref={animationRef} className="relative h-[1050vh] w-full">
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="relative h-full w-full">
              {/* TOP BORDER */}

              <div className={`absolute left-0 right-0 top-0 ${colors.topBorder}`} />

              {/* SMALL LABEL */}

              <motion.div
                style={
                  {
                    // opacity: headingOpacity,
                  }
                }
                className="absolute left-1/2 top-[19vh] z-10 w-auto -translate-x-1/2 text-center lg:left-[3vw] lg:top-[18vh] lg:translate-x-0 lg:text-left"
              >
                <div className={`mb-[-1px] text-[13px] font-normal leading-none tracking-[-0.025em] sm:text-[14px] ${colors.muted}`}>OUR PROCESS</div>
              </motion.div>

              {/* MAIN HEADING */}

              <motion.div
                style={
                  {
                    // opacity: headingOpacity,
                  }
                }
                className="absolute left-1/2 top-[20vh] z-10 w-auto -translate-x-1/2 text-center lg:left-[18vw] lg:top-[17vh] lg:translate-x-0 lg:text-left"
              >
                <motion.h2
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.4,
                  }}
                  className={`m-0 whitespace-nowrap text-[clamp(4rem,4.6vw,6.7rem)] font-light leading-[0.88] tracking-[-0.075em] ${colors.primary}`}
                >
                  {createCharacterAnimation('How we work')}
                </motion.h2>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.7,
                    ease,
                  }}
                  className={`mx-auto mt-[18px] max-w-[250px] text-[14px] leading-[1.2] tracking-[-0.025em] lg:mx-0 ${colors.secondary}`}
                >
                  A repeatable method applied
                  <br />
                  across every engagement.
                </motion.p>
              </motion.div>

              {/* =================================================
                  PROCESS TIMELINE
              ================================================= */}

              <div className="absolute left-[5%] right-[5%] top-[43vh] md:left-1/2 md:right-auto md:w-[86%] md:-translate-x-1/2 lg:left-[17.8vw] lg:right-[14vw] lg:top-[43vh] lg:w-auto lg:translate-x-0">
                {/* STEP CONTENT */}

                <div className="relative grid grid-cols-3">
                  <ProcessStepContent step={processSteps[0]} opacity={step1Opacity} y={step1Y} colors={colors} className="md:pr-6 lg:pr-[55px]" />

                  <ProcessStepContent step={processSteps[1]} opacity={step2Opacity} y={step2Y} colors={colors} className="px-4 md:px-2 md:pl-6 lg:pl-[35px] lg:pr-[55px]" />

                  <ProcessStepContent step={processSteps[2]} opacity={step3Opacity} y={step3Y} colors={colors} className="pl-2 md:pl-10 lg:pl-[35px]" />
                </div>

                {/* =================================================
                    DESKTOP GROWING TIMELINE
                ================================================= */}

                <div className="relative mt-[52px] h-[2px] w-full">
                  {/* GROWING LINE */}

                  <motion.div
                    style={{
                      width: growingLineWidth,
                    }}
                    className={`absolute left-1 top-1 h-[2px] ${colors.line}`}
                  />

                  {/* MOVING PLUS */}

                  <MovingPlus left={growingLineWidth} rotate={movingPlusRotate} opacity={movingPlusOpacity} colors={colors} />

                  {/* PLUS 1 */}

                  <TimelinePlus colors={colors} />

                  {/* PLUS 2 */}

                  <TimelinePlus left="37%" opacity={plus2Opacity} colors={colors} />

                  {/* PLUS 3 */}

                  <TimelinePlus left="71%" opacity={plus3Opacity} colors={colors} />

                  {/* FINAL PLUS */}

                  <TimelinePlus left="100%" opacity={plus4Opacity} colors={colors} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default HowItWorks;
