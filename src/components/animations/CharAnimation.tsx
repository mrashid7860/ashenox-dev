'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

export const createCharacterAnimation = (text: string) => {
  const characters = Array.from(text);

  // Create random character order
  const indexes = Array.from({ length: characters.length }, (_, index) => index);

  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  const revealPosition = new Map<number, number>();

  indexes.forEach((characterIndex, position) => {
    revealPosition.set(characterIndex, position);
  });

  return characters.map((character, index) => {
    // Keep spaces
    if (character === ' ') {
      return (
        <span key={`space-${index}`} className="inline-block">
          &nbsp;
        </span>
      );
    }

    const position = revealPosition.get(index) ?? 0;

    // Random extra delay
    const randomOffset = Math.random() * 0.15;

    // Random reveal timing
    const delay = position * 0.04 + randomOffset;

    return (
      <motion.span
        key={`${character}-${index}`}
        className="relative inline-block"
        initial={{
          opacity: 0,
          y: 25,
          filter: 'blur(180px)',
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }}
        viewport={{
          once: true,
          amount: 0.1,
        }}
        transition={{
          duration: 1.25,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {character}
      </motion.span>
    );
  });
};

/* ============================================================
   CHARACTER ANIMATION
============================================================ */

/* ============================================================
   CHARACTER ANIMATION
============================================================ */

export const charVariants = {
  hidden: {
    opacity: 0.04,
    y: 0,
    filter: 'blur(36px)',
  },
  visible: ({ enterDelay }: { enterDelay: number; exitDelay: number }) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.0,
      delay: enterDelay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  // Exit now mirrors "hidden" exactly — same opacity, same y, same blur,
  // same duration as the enter animation. Only the delay differs
  // (reversed stagger), so exit looks like enter played backwards.
  exit: ({ exitDelay }: { enterDelay: number; exitDelay: number }) => ({
    opacity: 0.04,
    y: 0,
    filter: 'blur(66px)',
    transition: {
      duration: 1.0,
      delay: exitDelay,
    },
  }),
};

function shuffle<T>(array: T[]) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createCharacterDelays(length: number) {
  const enterStep = 0.16;
  const exitStep = 0.08; // very tight per-char gap = fast overall, but still staggered individually

  const enterOrder = shuffle(Array.from({ length }, (_, index) => index));

  const enterDelays = new Array<number>(length);
  const exitDelays = new Array<number>(length);

  enterOrder.forEach((charIndex, position) => {
    const randomBit = Math.random() * 0.12;
    enterDelays[charIndex] = position * enterStep + randomBit;

    const reversedPosition = length - 1 - position;
    exitDelays[charIndex] = reversedPosition * exitStep; // no random jitter, keeps exit crisp
  });

  const enterDuration = 1.0;
  const exitDuration = 0.22;

  const totalEnterTime = Math.max(...enterDelays) + enterDuration;
  const totalExitTime = Math.max(...exitDelays) + exitDuration;

  return { enterDelays, exitDelays, totalEnterTime, totalExitTime };
}

/* ============================================================
   SINGLE ANIMATED WORD
============================================================ */

export function useAnimatedWord(word: string) {
  return useMemo(() => {
    const chars = word.split('');
    const { enterDelays, exitDelays, totalEnterTime, totalExitTime } = createCharacterDelays(chars.length);

    const element = (
      <span className="words relative inline-block" aria-hidden="true">
        {chars.map((char, charIndex) => (
          <motion.span
            key={`${word}-${charIndex}`}
            className="chars relative inline-block"
            variants={charVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{
              enterDelay: enterDelays[charIndex],
              exitDelay: exitDelays[charIndex],
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    );

    return { element, totalEnterTime, totalExitTime };
  }, [word]);
}
