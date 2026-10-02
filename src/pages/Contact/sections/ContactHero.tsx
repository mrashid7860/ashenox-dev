'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

import hangingLion from '@/assets/video/Sequence 06_2.mp4';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { CONTACT_COPY } from '@/data/contact.data';

/*
 * ============================================================
 * REUSABLE CHARACTER HEADING
 * ============================================================
 */

function CharacterHeading({ children, className = '', as = 'h2' }: { children: string; className?: string; as?: 'h1' | 'h2' }) {
  const Tag = motion[as];

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.25,
      }}
      className={className}
    >
      {createCharacterAnimation(children)}
    </Tag>
  );
}

export function ContactHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#d7d7d7] text-[#454545]">
      {/* ==================================================
          LION VIDEO — full-screen, behind all text
      ================================================== */}

      <motion.div
        initial={{
          y: -180,
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.25,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-0 z-0 mix-blend-darken"
      >
        <video src={hangingLion} autoPlay muted loop playsInline preload="auto" controls={false} className="h-full w-full select-none object-cover object-top" />
      </motion.div>

      {/* ==================================================
          CONTENT — sits above the video
      ================================================== */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] flex-col items-center justify-center px-5 pb-16 pt-0 text-center md:px-10">
        {/* TITLE */}

        <CharacterHeading as="h1" className="relative z-20 max-w-[1100px] text-[clamp(2.5rem,5.2vw,5rem)] font-normal leading-[0.9] tracking-[-0.075em] text-[#fff]">
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 1,
          }}
          className="absolute bottom-10 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-[#707070]/70"
        >
          <motion.div
            animate={{
              y: ['-180%', '0%', '0%', '180%'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.6,
              times: [0, 0.4, 0.65, 1],
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute flex items-center justify-center"
          >
            <ArrowDown size={10} strokeWidth={1.2} className="shrink-0 text-[#707070]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
