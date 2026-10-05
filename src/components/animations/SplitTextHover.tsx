// 'use client';

// import { motion, useAnimationControls } from 'framer-motion';

// type SplitTextHoverProps = {
//   text: string;
//   className?: string;
// };

// const EXIT_Y = 16;
// const EXIT_PAIR_STAGGER = 0.05;
// const EXIT_DURATION = 0.4;
// const EXIT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

// const TYPE_STAGGER = 0.045;
// const TYPE_DURATION = 0.35;
// const TYPE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// export function SplitTextHover({ text, className = '' }: SplitTextHoverProps) {
//   const charControls = useAnimationControls();
//   const chars = Array.from(text);

//   const handleHoverStart = async () => {
//     // Phase 1 — exit: paired stagger, even chars rise + odd chars fall, blurring together
//     await charControls.start((index: number) => ({
//       y: index % 2 === 0 ? -EXIT_Y : EXIT_Y,
//       opacity: 0,
//       filter: 'blur(10px)',
//       transition: {
//         duration: EXIT_DURATION,
//         delay: Math.floor(index / 2) * EXIT_PAIR_STAGGER,
//         ease: EXIT_EASE,
//       },
//     }));

//     // snap position back with no visible jump (already invisible)
//     await charControls.start(() => ({
//       y: 0,
//       opacity: 0,
//       filter: 'blur(10px)',
//       transition: { duration: 0 },
//     }));

//     // Phase 2 — typewriter reveal, left to right, blur clearing per char
//     charControls.start((index: number) => ({
//       opacity: 1,
//       filter: 'blur(0px)',
//       transition: {
//         duration: TYPE_DURATION,
//         delay: index * TYPE_STAGGER,
//         ease: TYPE_EASE,
//       },
//     }));
//   };

//   const handleHoverEnd = () => {
//     charControls.stop();

//     charControls.start((index: number) => ({
//       y: 0,
//       opacity: 1,
//       filter: 'blur(0px)',
//       transition: {
//         duration: 0.25,
//         delay: index * 0.015,
//         ease: 'easeOut',
//       },
//     }));
//   };

//   return (
//     <span className={`inline-flex items-baseline ${className}`} onMouseEnter={handleHoverStart} onMouseLeave={handleHoverEnd} aria-label={text}>
//       {chars.map((char, index) => (
//         <motion.span
//           key={`${char}-${index}`}
//           custom={index}
//           animate={charControls}
//           initial={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
//           className="inline-block align-baseline leading-none will-change-[opacity,filter,transform]"
//         >
//           {char === ' ' ? '\u00A0' : char}
//         </motion.span>
//       ))}
//     </span>
//   );
// }

'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useRef } from 'react';

type SplitTextHoverProps = {
  text: string;
  className?: string;
};

const EXIT_Y = 16;
const EXIT_PAIR_STAGGER = 0.05;
const EXIT_DURATION = 0.4;
const EXIT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const TYPE_STAGGER = 0.045;
const TYPE_DURATION = 0.35;
const TYPE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SplitTextHover({ text, className = '' }: SplitTextHoverProps) {
  const charControls = useAnimationControls();

  /*
   * FIX:
   * Tracks the latest hover interaction.
   *
   * This prevents an old async animation from
   * continuing after the mouse has left.
   */
  const animationId = useRef(0);

  const chars = Array.from(text);

  const handleHoverStart = async () => {
    const currentAnimationId = ++animationId.current;

    // Phase 1 — exit: paired stagger, even chars rise + odd chars fall, blurring together
    await charControls.start((index: number) => ({
      y: index % 2 === 0 ? -EXIT_Y : EXIT_Y,
      opacity: 0,
      filter: 'blur(10px)',
      transition: {
        duration: EXIT_DURATION,
        delay: Math.floor(index / 2) * EXIT_PAIR_STAGGER,
        ease: EXIT_EASE,
      },
    }));

    /*
     * FIX:
     * If hover ended while Phase 1 was running,
     * stop this hover sequence here.
     */
    if (currentAnimationId !== animationId.current) {
      return;
    }

    // snap position back with no visible jump (already invisible)
    await charControls.start(() => ({
      y: 0,
      opacity: 0,
      filter: 'blur(10px)',
      transition: { duration: 0 },
    }));

    /*
     * FIX:
     * Check again before starting Phase 2.
     */
    if (currentAnimationId !== animationId.current) {
      return;
    }

    // Phase 2 — typewriter reveal, left to right, blur clearing per char
    charControls.start((index: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: TYPE_DURATION,
        delay: index * TYPE_STAGGER,
        ease: TYPE_EASE,
      },
    }));
  };

  const handleHoverEnd = () => {
    /*
     * FIX:
     * Invalidate the currently running hover sequence.
     */
    animationId.current += 1;

    charControls.stop();

    /*
     * EXACT SAME fallback animation as before.
     * No animation behavior changed.
     */
    charControls.start((index: number) => ({
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.25,
        delay: index * 0.015,
        ease: 'easeOut',
      },
    }));
  };

  return (
    <span className={`inline-flex items-baseline ${className}`} onMouseEnter={handleHoverStart} onMouseLeave={handleHoverEnd} aria-label={text}>
      {chars.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          custom={index}
          animate={charControls}
          initial={{
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
          }}
          className="inline-block align-baseline leading-none will-change-[opacity,filter,transform]"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}
