'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ProcessToFounderTransition() {
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  /*
   * This is ONLY the transition progress.
   *
   * Founder itself remains in normal document flow.
   */

  const processScale = useTransform(scrollYProgress, [0, 1], [1, 0.985]);

  return (
    <section ref={ref} className="relative h-[100vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* =================================================
            PROCESS LAST FRAME
            ================================================= */}

        <motion.div
          style={{
            scale: processScale,
          }}
          className="absolute inset-0 z-0 h-screen w-full"
        />
      </div>
    </section>
  );
}
