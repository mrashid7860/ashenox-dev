'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { createCharacterAnimation, useAnimatedWord } from '@/components/animations/CharAnimation';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { homeData } from '@/data/home.data';
import { ContactFormPanel } from '@/components/navigation/ContactFormPanel';

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
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 180], [1, 0]);
  const [contactOpen, setContactOpen] = useState(false);

  const closeContact = () => {
    setContactOpen(false);
  };

  const handleContactClick = () => {
    setContactOpen(true);
  };
  return (
    <>
      <section id="hero" className="relative h-screen w-full overflow-hidden">
        <div className="noise-overlay absolute inset-0 z-[6]" />

        {/* Main content */}
        <div className="relative z-10 mt-10 h-full flex-col justify-center px-3 py-10 sm:px-6 lg:px-6">
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
                onClick={handleContactClick}
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
        <div className="absolute bottom-16 left-0 right-0 z-20 px-6">
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
            className="pointer-events-none absolute left-[1.5%] top-[calc(93.5vh)] flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-white/35 md:top-[75%] lg:top-[41%] xl:top-[51%] 2xl:top-[67%]"
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
              <ArrowDown size={10} strokeWidth={1.2} className="shrink-0 text-white/35" />
            </motion.div>
          </motion.div>
          {/* CENTER: HOLD TO BLAST */}
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
              delay: 2,
              duration: 1,
              ease: HERO_EASE,
            }}
            className="pointer-events-none absolute inset-x-4 bottom-0 z-30 flex h-10 w-full items-center justify-start text-left md:justify-center md:text-center"
          >
            <p className="text-[11px] uppercase leading-[1.4] text-white/35 md:mt-8">
              <span className="md:hidden">
                TAP ONCE ✦ SEE
                <br />
                THE MAGIC
              </span>

              <span className="hidden md:inline">TAP ONCE ✦ SEE THE MAGIC</span>
            </p>
          </motion.div>

          {/* EXPERIENCE */}
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
            className="absolute bottom-0 right-[8px] flex w-[190px] flex-col items-end px-1 md:right-[20px]"
          >
            {/* EXPERIENCE BOX */}
            <div className="flex w-full overflow-hidden border border-white/10">
              <div className="flex h-[60px] w-[70px] shrink-0 flex-col items-center justify-center border-r border-white/10">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-white/80">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />

                  <path d="M4 12H20" stroke="currentColor" strokeWidth="1.2" />

                  <path d="M12 4C9.5 6.5 9.5 17.5 12 20" stroke="currentColor" strokeWidth="1.2" />

                  <path d="M12 4C14.5 6.5 14.5 17.5 12 20" stroke="currentColor" strokeWidth="1.2" />
                </svg>

                <span className="text-[9px] uppercase tracking-[0.006em] text-white/80">{hero.experience.established}</span>
              </div>

              <div className="flex min-w-0 flex-1 items-center px-3">
                <p className="text-[11px] uppercase leading-[1] tracking-[-0.05em] text-white/80 [word-spacing:2px]">{hero.experience.years}</p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-2 w-full md:mt-3">
              <p className="text-[11px] leading-[1.2] text-white/80 [word-spacing:2px] md:leading-[1.1]">{hero.experience.description}</p>
            </div>
          </motion.div>

          <div className="h-10 w-10" />
        </div>
      </section>
      <ContactFormPanel open={contactOpen} onClose={closeContact} />
    </>
  );
}
