import { motion } from 'framer-motion';

/* ============================================================
   WORD ANIMATION
============================================================ */

export const wordVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: 'blur(100px)',
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
};

/* ============================================================
   RANDOM SHUFFLE
============================================================ */

function shuffle<T>(array: T[]) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/* ============================================================
   CREATE WORD ANIMATION

   delayStep:
   Controls the delay between random reveal positions.

   Default = 0.18
============================================================ */

export const createWordAnimation = (text: string, delayStep: number = 0.18) => {
  const words = text.trim().split(/\s+/);

  /* ==========================================================
     HOW MANY WORDS SHOULD ANIMATE
  ========================================================== */

  let animatedCount: number;

  if (words.length <= 2) {
    animatedCount = words.length;
  } else if (words.length <= 10) {
    animatedCount = Math.random() < 0.5 ? Math.floor(words.length * 0.7) : Math.ceil(words.length * 0.8);
  } else {
    animatedCount = Math.random() < 0.5 ? Math.floor(words.length * 0.8) : Math.ceil(words.length * 0.85);
  }

  animatedCount = Math.max(1, Math.min(animatedCount, words.length));

  /* ==========================================================
     CREATE RANDOM WORD ORDER
  ========================================================== */

  const allIndexes = Array.from({ length: words.length }, (_, index) => index);

  const shuffledIndexes = shuffle(allIndexes);

  const animatedIndexes = new Set(shuffledIndexes.slice(0, animatedCount));

  /* ==========================================================
     RANDOM REVEAL ORDER
  ========================================================== */

  const revealOrder = shuffle(Array.from(animatedIndexes));

  const revealPosition = new Map<number, number>();

  revealOrder.forEach((wordIndex, position) => {
    revealPosition.set(wordIndex, position);
  });

  /* ==========================================================
     BUILD WORDS
  ========================================================== */

  return words.map((word, index) => {
    const shouldAnimate = animatedIndexes.has(index);

    /* ========================================================
       STATIC WORD
    ======================================================== */

    if (!shouldAnimate) {
      return (
        <span key={`${word}-${index}`} className="words relative inline-block" aria-hidden="true">
          {word}
          &nbsp;
        </span>
      );
    }

    /* ========================================================
       RANDOM DELAY
    ======================================================== */

    const position = revealPosition.get(index) ?? 0;

    /*
     * Small random variation.
     */
    const randomOffset = Math.random() * 0.2;

    const delay = position * delayStep + randomOffset;

    return (
      <motion.span
        key={`${word}-${index}`}
        className="words relative inline-block"
        variants={wordVariants}
        transition={{
          duration: 1.8,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        aria-hidden="true"
      >
        {word.split('').map((char, charIndex) => (
          <span key={`${word}-${charIndex}`} className="chars relative inline-block">
            {char}
          </span>
        ))}

        <span className="inline-block">&nbsp;</span>
      </motion.span>
    );
  });
};
