'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { CONTACT_COPY } from '@/data/contact.data';

/*
 * ============================================================
 * REUSABLE CHARACTER HEADING
 * ============================================================
 */

function CharacterHeading({ children, className = '', as = 'h2' }: { children: string; className?: string; as?: 'h1' | 'h2' }) {
  const { scrollY } = useScroll();

  const scrollIndicatorOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  const Heading = as === 'h1' ? motion.h1 : motion.h2;

  return (
    <Heading
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.25,
      }}
      className={className}
    >
      {createCharacterAnimation(children)}
    </Heading>
  );
}

export function ContactHero() {
  const { scrollY } = useScroll();

  const scrollIndicatorOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  return (
    <section className="relative min-h-screen overflow-hidden text-[#454545]">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] flex-col items-center justify-center px-5 pb-16 pt-0 text-center md:px-10">
        {/* TITLE */}
        <CharacterHeading as="h1" className="relative z-20 max-w-[1100px] text-[clamp(2.5rem,8.2vw,5rem)] font-normal leading-[0.9] tracking-[-0.075em] text-[#fff]">
          {CONTACT_COPY.heroTitle}
        </CharacterHeading>

        {/* DESCRIPTION */}
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
            delay: 0.68,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-20 mt-5 max-w-[380px] text-[13px] leading-[1.2] tracking-[-0.03em] text-[#fff] md:mt-4 md:max-w-[430px] md:text-[14px]"
        >
          {CONTACT_COPY.heroDescription[0]}
          <br />
          {CONTACT_COPY.heroDescription[1]}
        </motion.p>

        {/* SCROLL INDICATOR */}
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
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            opacity: scrollIndicatorOpacity,
          }}
          className="pointer-events-none absolute left-1/2 top-[calc(100dvh-32px)] z-40 flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-white"
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
            className="absolute left-[2.5px] flex -translate-x-1/2 items-center justify-center"
          >
            <ArrowDown size={10} strokeWidth={1.2} className="shrink-0 text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
