import { motion } from 'framer-motion';

/* ============================================================
   WORD ANIMATION
============================================================ */

export const wordVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: 'blur(140px)',
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
============================================================ */

export const createWordAnimation = (text: string) => {
  const words = text.trim().split(/\s+/);

  /* ==========================================================
     HOW MANY WORDS SHOULD ANIMATE
     
     12 words → around 9–10
     20 words → around 15–17
     30 words → around 23–26
  ========================================================== */

  let animatedCount: number;

  if (words.length <= 2) {
    animatedCount = words.length;
  } else if (words.length <= 10) {
    animatedCount = Math.random() < 0.5 ? Math.floor(words.length * 0.7) : Math.ceil(words.length * 0.8);
  } else {
    /*
     * Keep roughly 80–85% animated.
     */
    animatedCount = Math.random() < 0.5 ? Math.floor(words.length * 0.8) : Math.ceil(words.length * 0.85);
  }

  animatedCount = Math.max(1, Math.min(animatedCount, words.length));

  /* ==========================================================
     CREATE RANDOM WORD ORDER
     
     Example:
     [0,1,2,3,4,5,6,7,8,9,10,11]

     becomes:

     [10,2,7,0,11,4,8,1,6,3,9,5]
  ========================================================== */

  const allIndexes = Array.from({ length: words.length }, (_, index) => index);

  const shuffledIndexes = shuffle(allIndexes);

  /*
   * Select random words that should animate.
   */
  const animatedIndexes = new Set(shuffledIndexes.slice(0, animatedCount));

  /*
   * IMPORTANT:
   *
   * Create a RANDOM REVEAL ORDER only for
   * the selected animated words.
   *
   * This is what prevents:
   *
   * 1 → 2 → 3 → 4 → 5
   *
   * and creates:
   *
   * 11 → 3 → 8 → 1 → 6 → 12 ...
   */

  const revealOrder = shuffle(Array.from(animatedIndexes));

  /*
   * Map:
   *
   * word index → random animation position
   */
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
       
       Delay is based on RANDOM REVEAL POSITION,
       NOT original word index.
       
       Therefore animation is NOT:
       
       1 → 2 → 3 → 4 → 5
       
       Instead:
       
       11 → 3 → 8 → 12 → 4 → 1 ...
    ======================================================== */

    const position = revealPosition.get(index) ?? 0;

    /*
     * Small random variation so even two consecutive
     * words don't feel mechanically timed.
     */
    const randomOffset = Math.random() * 0.18;

    /*
     * Slow overall reveal.
     *
     * Increase 0.22 → slower
     * Decrease 0.12 → faster
     */
    const delay = position * 0.22 + randomOffset;

    return (
      <motion.span
        key={`${word}-${index}`}
        className="words relative inline-block"
        variants={wordVariants}
        transition={{
          /*
           * VERY SLOW BLUR REVEAL
           */
          duration: 1.8,

          /*
           * RANDOM REVEAL ORDER
           */
          delay,

          /*
           * Smooth cinematic movement
           */
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
