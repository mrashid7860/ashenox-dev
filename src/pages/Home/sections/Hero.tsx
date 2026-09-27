'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

import { scrollToId } from '@/utils/lenis';
import { createCharacterAnimation, useAnimatedWord } from '@/components/animations/CharAnimation';
import { AnimatedButton } from '@/components/animations/AnimatedButton';

import { HeroScene } from './HeroScene';
import { homeData } from '@/data/home.data';

export const HERO_EASE = [0.16, 1, 0.3, 1] as const;

export const HERO_CONFIG = {
  heading: {
    holdAfterEnterMs: 2200,
  },

  background: {
    particleCount: 30,
  },

  scene: {
    fadeInDelay: 0.5,
    fadeInDuration: 1.2,
  },

  cta: {
    widthClassName: 'w-[200px]',
    charShift: 56,
    iconSize: 14,
  },

  scroll: {
    fadeInDelay: 1.8,
    fadeInDuration: 1,
  },

  experience: {
    fadeInDelay: 1.9,
  },
} as const;

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  vertical: boolean;
};

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 6,
    vertical: Math.random() > 0.5,
  }));
}

const particles = createParticles(HERO_CONFIG.background.particleCount);

function useMouseParallax() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
}

function Background({ px, py }: { px: number; py: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#020202]" />

      <motion.div
        className="absolute -left-40 top-10 h-[600px] w-[600px] rounded-full bg-white/[0.04] blur-[160px]"
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transform: `translate(${px * 25}px, ${py * 25}px)`,
        }}
      />

      <motion.div
        className="absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-[#ff6020]/[0.04] blur-[160px]"
        animate={{
          x: [0, -50, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transform: `translate(${px * -25}px, ${py * -25}px)`,
        }}
      />

      {/* Subtle diagonal grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 80px)',
          transform: `translate(${px * -12}px, ${py * -12}px)`,
        }}
      />

      {/* Ambient particles */}
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: 0.15,
            transform: `translate(${px * 12}px, ${py * 12}px)`,
          }}
          animate={
            particle.vertical
              ? {
                  y: [0, -40, 0],
                  opacity: [0, 0.3, 0],
                }
              : {
                  x: [0, 30, 0],
                  opacity: [0, 0.3, 0],
                }
          }
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function Heading() {
  const { heading } = homeData.hero;

  const [wordIndex, setWordIndex] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  const { element, totalEnterTime, totalExitTime } = useAnimatedWord(heading.rotatingWords[wordIndex]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        if (!introDone) {
          setIntroDone(true);
          return;
        }

        setWordIndex((index) => (index + 1) % heading.rotatingWords.length);
      },
      !introDone ? totalEnterTime * 500 : totalEnterTime * 1000 + HERO_CONFIG.heading.holdAfterEnterMs
    );

    return () => window.clearTimeout(timer);
  }, [introDone, totalEnterTime, heading.rotatingWords.length]);

  return (
    <motion.div className="relative z-10">
      <h1 className="font relative z-10 text-left text-[clamp(2.8rem,9vw,4.6rem)] leading-[0.88] tracking-[-0.06em] text-white/80 md:text-[clamp(1.8rem,9vw,4.6rem)]">
        {createCharacterAnimation(heading.prefix[0])}
        <br />
        {createCharacterAnimation(heading.prefix[1])}{' '}
        {!introDone ? (
          createCharacterAnimation(heading.rotatingWords[0])
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${heading.rotatingWords[wordIndex]}-${wordIndex}`}
              className="inline-block"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 1,
                transition: {
                  duration: totalExitTime,
                },
              }}
            >
              {element}
            </motion.span>
          </AnimatePresence>
        )}
      </h1>
    </motion.div>
  );
}

export function Hero() {
  const { hero } = homeData;

  const { scrollY } = useScroll();

  const mouse = useMouseParallax();

  /*
   * All scroll transforms must be created inside
   * the component because useScroll/useTransform are hooks.
   */
  const backgroundScale = useTransform(scrollY, [0, 600], [1, 1.08]);

  const sceneY = useTransform(scrollY, [0, 600], [0, 80]);

  const sceneOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const scrollIndicatorOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <motion.div style={{ scale: backgroundScale }} className="absolute inset-0">
        <Background px={mouse.x} py={mouse.y} />
      </motion.div>

      {/* 3D scene */}
      <motion.div
        style={{
          y: sceneY,
          opacity: sceneOpacity,
        }}
        className="absolute inset-0 z-[5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: HERO_CONFIG.scene.fadeInDelay,
          duration: HERO_CONFIG.scene.fadeInDuration,
          ease: HERO_EASE,
        }}
      >
        <HeroScene />
      </motion.div>

      <div className="noise-overlay absolute inset-0 z-[6]" />

      {/* Main content */}
      <div className="lg:px-15 relative z-10 mt-10 h-full flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mt-0 w-full">
          <Heading />

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.7,
              duration: 1,
              ease: HERO_EASE,
            }}
            className="mt-8 w-fit sm:mt-8"
          >
            <AnimatedButton
              onClick={() => scrollToId(hero.cta.target)}
              dataCursor={hero.cta.cursorLabel}
              variant="animated"
              icon="right"
              iconSize={HERO_CONFIG.cta.iconSize}
              widthClassName={HERO_CONFIG.cta.widthClassName}
              className="pb-0 font-mono"
              charShift={HERO_CONFIG.cta.charShift}
            >
              {hero.cta.label}
            </AnimatedButton>
          </motion.div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-6 sm:px-12 lg:px-20">
        {/* <motion.button
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: HERO_CONFIG.scroll.fadeInDelay,
            duration: HERO_CONFIG.scroll.fadeInDuration,
            ease: HERO_EASE,
          }}
          onClick={() => scrollToId(hero.scroll.target)}
          aria-label={hero.scroll.ariaLabel}
          className="absolute bottom-0 left-3 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-white/40 hover:text-white md:left-12"
        >
          <ArrowDown className="h-3 w-3" />
        </motion.button> */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            delay: 1,
            ease: HERO_EASE,
          }}
          style={{
            opacity: scrollIndicatorOpacity,
          }}
          className="pointer-events-none absolute left-[2.5%] top-[calc(93.5vh)] flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-white md:top-[75%] lg:top-[41%] xl:top-[51%] 2xl:top-[47%]"
        >
          <motion.div
            animate={{
              y: ['-250%', '0%', '0%', '250%'],
            }}
            transition={{
              duration: 1.8,
              times: [0, 0.32, 0.38, 1],
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-[3px] flex items-center justify-center"
          >
            <ArrowDown size={10} strokeWidth={1.2} className="shrink-0 text-white" stroke="white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            x: 30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: HERO_CONFIG.experience.fadeInDelay,
          }}
          className="absolute bottom-0 right-[8px] flex flex-col items-end md:right-[20px]"
        >
          <div className="flex overflow-hidden border border-white/10">
            <div className="flex h-[60px] w-[70px] flex-col items-center justify-center border-r border-white/10">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-white/80">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />

                <path d="M4 12H20" stroke="currentColor" strokeWidth="1.2" />

                <path d="M12 4C9.5 6.5 9.5 17.5 12 20" stroke="currentColor" strokeWidth="1.2" />

                <path d="M12 4C14.5 6.5 14.5 17.5 12 20" stroke="currentColor" strokeWidth="1.2" />
              </svg>

              <span className="text-[9px] uppercase tracking-[0.006em] text-white/80">{hero.experience.established}</span>
            </div>

            <div className="flex w-[120px] items-center px-3">
              <p className="text-[11px] uppercase leading-[1] tracking-[-0.05em] text-white/80 [word-spacing:2px]">{hero.experience.years}</p>
            </div>
          </div>

          <div className="mt-2 w-[185px] self-start md:mt-4 md:w-[215px]">
            <p className="text-justify text-[14px] leading-[1.2] text-white/80 [word-spacing:2px] md:text-[16px] md:leading-[1.1]">{hero.experience.description}</p>
          </div>
        </motion.div>

        <div className="h-10 w-10" />
      </div>
    </section>
  );
}
