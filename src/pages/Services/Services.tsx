'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HowItWorks from './sections/HowItWorks';
import { TechnologyStack } from './sections/TechnologyStack';
import { ServiceCapabilities } from './sections/ServiceCapabilities';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { createWordAnimation } from '@/components/animations/wordAnimation';
import { MarqueeSection } from '@/components/common/MarqueeSection';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { AeroBackground } from '@/pages/Home/sections/AeroBackground';
import { usePageTransition } from '@/components/common/PageLoader';
import { ContactFormPanel } from '@/components/navigation/ContactFormPanel';
const ease = [0.16, 1, 0.3, 1] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

// ============================================================
// ORBITAL OBJECT
// ============================================================

function OrbitShape({ type, className, delay = 0 }: { type: 'ring' | 'bars' | 'arc' | 'square'; className?: string; delay?: number }) {
  if (type === 'ring') {
    return (
      <motion.div
        className={cn('pointer-events-none absolute', className)}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'linear',
          delay,
        }}
      >
        <div className="relative h-[110px] w-[110px] rounded-full">
          {Array.from({ length: 7 }).map((_, index) => (
            <span
              key={index}
              className="absolute inset-0 rounded-full border border-white/[0.10]"
              style={{
                transform: `scale(${1 - index * 0.1})`,
              }}
            />
          ))}

          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/[0.08]" />
        </div>
      </motion.div>
    );
  }

  if (type === 'bars') {
    return (
      <motion.div
        className={cn('pointer-events-none absolute flex gap-[5px]', className)}
        animate={{
          rotate: [0, 5, -5, 0],
          y: [0, -8, 8, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <span
            key={index}
            className="h-[90px] w-[2px] bg-white/[0.09]"
            style={{
              transform: `rotate(${index * 2 - 9}deg)`,
            }}
          />
        ))}
      </motion.div>
    );
  }

  if (type === 'square') {
    return (
      <motion.div
        className={cn('pointer-events-none absolute', className)}
        animate={{
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'linear',
          delay,
        }}
      >
        <div className="relative h-[100px] w-[100px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="absolute inset-0 border border-white/[0.08]"
              style={{
                transform: `scale(${1 - index * 0.12}) rotate(${index * 8}deg)`,
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn('pointer-events-none absolute', className)}
      animate={{
        rotate: [0, 12, -12, 0],
        scale: [1, 1.05, 0.97, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <div className="h-[120px] w-[120px] rounded-[50%] border border-white/[0.09]" />
    </motion.div>
  );
}

// ============================================================
// ORBITAL BACKGROUND
// ============================================================

function OrbitalBackground({ broken = false, marquee = false }: { broken?: boolean; marquee?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* ======================================================
          MAIN ORBITS
      ====================================================== */}

      <motion.div
        className={cn(
          'absolute left-1/2 top-1/2 h-[65vw] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.08]',
          broken && '-translate-x-[75%] rotate-[-12deg] md:-translate-x-[58%]'
        )}
        animate={
          broken
            ? {
                rotate: -12,
                scale: 0.9,
              }
            : {
                rotate: [0, 360],
              }
        }
        transition={
          broken
            ? {
                duration: 1.2,
                ease,
              }
            : {
                duration: 45,
                repeat: Infinity,
                ease: 'linear',
              }
        }
      />

      <motion.div
        className={cn(
          'absolute left-1/2 top-1/2 h-[52vw] w-[78vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.055]',
          broken && 'translate-x-[35%] rotate-[18deg] md:translate-x-[50%]'
        )}
        animate={
          broken
            ? {
                rotate: 18,
                scale: 0.85,
              }
            : {
                rotate: [360, 0],
              }
        }
        transition={
          broken
            ? {
                duration: 1.1,
                ease,
              }
            : {
                duration: 36,
                repeat: Infinity,
                ease: 'linear',
              }
        }
      />

      <motion.div
        className={cn('absolute left-1/2 top-1/2 h-[39vw] w-[67vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.045]', broken && 'translate-y-[20%] rotate-[-28deg]')}
        animate={
          broken
            ? {
                rotate: -28,
                scale: 0.75,
              }
            : {
                rotate: [0, -360],
              }
        }
        transition={
          broken
            ? {
                duration: 1,
                ease,
              }
            : {
                duration: 32,
                repeat: Infinity,
                ease: 'linear',
              }
        }
      />

      {/* ======================================================
          ORBIT OBJECTS
      ====================================================== */}

      <OrbitShape type="bars" className={cn('left-[7%] top-[15%] rotate-[-35deg]', broken && 'left-[-3%] top-[7%]')} />

      <OrbitShape type="ring" className={cn('bottom-[27%] left-[10%]', broken && 'bottom-[8%] left-[-4%]')} delay={2} />

      <OrbitShape type="bars" className={cn('left-1/2 top-[7%] -translate-x-1/2 rotate-[90deg]', broken && 'left-[50%] top-[-5%]')} delay={1} />

      <OrbitShape type="ring" className={cn('right-[11%] top-[18%]', broken && 'right-[-5%] top-[4%]')} delay={3} />

      <OrbitShape type="bars" className={cn('bottom-[27%] right-[5%] rotate-[15deg]', broken && 'bottom-[6%] right-[-6%]')} delay={4} />

      <OrbitShape type="square" className={cn('bottom-[5%] right-[15%]', broken && 'bottom-[0%] right-[-2%]')} />

      {/* ======================================================
          MARQUEE OBJECTS
      ====================================================== */}

      {marquee && (
        <>
          <motion.div
            className="absolute left-[32%] top-[12%] h-[80px] w-[180px] border border-white/[0.12]"
            animate={{
              rotate: [0, 8, -4, 0],
              x: [0, 40, -20, 0],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="absolute left-[48%] top-[55%] h-[110px] w-[110px] rounded-full border border-white/[0.11]"
            animate={{
              rotate: [0, 360],
              y: [0, -30, 10, 0],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="absolute right-[30%] top-[16%] h-[75px] w-[170px] border border-white/[0.09]"
            animate={{
              rotate: [0, -10, 5, 0],
              x: [0, -30, 20, 0],
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}
    </div>
  );
}

// ============================================================
// AREA OF EXPERTISE
// ============================================================
function ExpertiseHero() {
  const ref = useRef<HTMLElement | null>(null);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden text-white">
      {/* Main Heading */}
      <div className="relative z-10 flex w-full -translate-y-[2svh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-[clamp(0.5rem,1.5svh,1rem)] flex items-center justify-center gap-1 text-[11px] uppercase tracking-[-0.02em] text-white/75 md:text-[14px]">
          <span>✦</span>
          <span>WHAT WE DO BEST</span>
        </div>

        <h1 className="text-[clamp(3rem,7.5vw,8.5rem)] font-light leading-[0.86] tracking-[-0.05em] md:text-[clamp(3.5rem,7.5vw,4.5rem)]">{createCharacterAnimation('Area of expertise')}</h1>
      </div>

      {/* Bottom Description */}
      <div className="absolute inset-x-0 bottom-[clamp(1.5rem,6svh,4rem)] z-10 mx-auto w-[min(270px,80vw)] text-center text-[11px] uppercase leading-[1.3] tracking-[0.02em] text-white/35 md:w-[400px] md:text-[12px]">
        <div>AI &amp; INTELLIGENT AUTOMATION WEB DEVELOPMENT &nbsp; PRODUCT DESIGN WEBSITE &amp; MOBILE DESIGN &nbsp; WORDPRESS DEVELOPMENT BRANDING</div>
      </div>
    </section>
  );
}

// ============================================================
// FOCUSED DISCIPLINES
// ============================================================

function FocusedDisciplines() {
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const broken = useTransform(scrollYProgress, [0.42, 0.55], [0, 1]);
  const go = usePageTransition();

  const [contactOpen, setContactOpen] = useState(false);

  const handleDiscussProject = () => {
    setContactOpen(true);
  };

  const closeContact = () => {
    setContactOpen(false);
  };

  return (
    <>
      <section ref={ref} className="relative h-[50vh] overflow-hidden text-white lg:mt-10 lg:h-[60vh]">
        {/* Background */}
        <motion.div
          style={{
            opacity: useTransform(broken, [0, 1], [0, 1]),
          }}
          className="absolute inset-0"
        >
          <OrbitalBackground broken />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="mx-auto text-[clamp(2rem,5vw,4.5rem)] font-light leading-[0.88] tracking-[-0.075em] text-white/80 md:text-[clamp(3rem,6.8vw,4.4rem)]"
          >
            {createWordAnimation('Focused disciplines')}
            <br />
            {createWordAnimation('where strategy, design, and')}
            <br />
            {createWordAnimation('technology work as one.')}
          </motion.h2>

          {/* Buttons */}
          <motion.div className="relative z-10 mt-16 w-full text-center text-[10px] uppercase tracking-[0.03em] text-white/80">
            <div className="mx-auto flex w-full items-center justify-center gap-10 px-6 md:max-w-[400px]">
              {/* VIEW PROJECTS */}
              <AnimatedButton
                onClick={() => go('/portfolio', 'WORK')}
                variant="animated"
                borderColor="rgba(255, 255, 255, 0.8)"
                icon="right"
                charShift={55}
                charStagger={0.025}
                charDuration={0.75}
                widthClassName="w-[150px]"
                className="group relative flex items-center justify-between font-mono uppercase"
              >
                VIEW PROJECTS
              </AnimatedButton>

              {/* LET'S CONNECT */}
              <AnimatedButton
                onClick={handleDiscussProject}
                variant="animated"
                borderColor="rgba(255, 255, 255, 0.8)"
                icon="right"
                charShift={57}
                charStagger={0.025}
                charDuration={0.75}
                widthClassName="w-[150px]"
                className="group relative flex items-center justify-between font-mono uppercase"
              >
                LET'S CONNECT
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact panel OUTSIDE overflow-hidden section */}
      <ContactFormPanel open={contactOpen} onClose={closeContact} />
    </>
  );
}

function DisciplineMarquee() {
  return (
    <MarqueeSection
      words={['A.I.', 'DESIGN', 'DEVELOPMENT', 'BRANDING']}
      caption="CAPABILITIES SHAPED TO SCALE WITH AMIBITON."
      heightClass="min-h-[220px] md:h-[20vh] lg:h-[60vh]"
      textSizeClass="text-[clamp(4rem,8.5vw,7.5rem)]"
      captionPositionClass="bottom-[40%]"
    />
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export function Service() {
  return (
    <main className="overflow-x-clip">
      <section className="relative">
        {/* Background */}
        <div className="pointer-events-none sticky top-0 z-0 h-screen w-full">
          <AeroBackground />
        </div>

        {/* Content */}
        <div className="relative z-10 -mt-[100vh]">
          <ExpertiseHero />
          <FocusedDisciplines />
          <DisciplineMarquee />
        </div>
      </section>

      <ServiceCapabilities />
      <TechnologyStack />
      <HowItWorks mobileHeight="100vh" />
    </main>
  );
}
