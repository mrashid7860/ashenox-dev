import { motion } from 'framer-motion';
import { useRef } from 'react';

import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { createWordAnimation } from '@/components/animations/wordAnimation';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';
import { usePageTransition } from '@/components/common/PageLoader';

function DifferentSkills() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const go = usePageTransition();

  return (
    <section ref={sectionRef} className="relative isolate z-[40] w-full overflow-visible bg-[#050609] px-4 text-[#D8D8D8] md:h-[63vh] lg:min-h-screen">
      {/* =====================================================
          STICKY SCREEN
      ===================================================== */}
      <div className="sticky top-0 z-[60] mt-0 flex h-screen w-full justify-center overflow-hidden md:mt-[-250px] lg:mt-0">
        {/* =====================================================
            CENTERED COMPOSITION
        ===================================================== */}
        <div className="relative mx-auto h-full w-full max-w-[1600px]">
          {/* DIFFERENT */}
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.4,
            }}
            className="absolute left-[1.4vw] top-[20vh] m-0 whitespace-nowrap text-[clamp(4rem,7.8vw,9rem)] font-light leading-[0.85] tracking-[-0.085em] sm:left-[50%] sm:top-[20vh] sm:-translate-x-[98%] md:left-[10.4vw] md:top-[0vh] md:translate-x-0 md:text-[clamp(4rem,8.5vw,9rem)] lg:left-[10.4vw] lg:top-[17.2vh] lg:text-[clamp(4rem,7.8vw,9rem)]"
          >
            {createCharacterAnimation('DIFFERENT')}
          </motion.h2>

          {/* SKILLS. ONE */}
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.4,
            }}
            className="absolute left-[10vw] top-[27vh] whitespace-nowrap text-[clamp(4rem,7.8vw,9rem)] font-light leading-[0.85] tracking-[-0.085em] sm:left-[50%] sm:top-[27vh] sm:-translate-x-[48%] md:left-[26.4vw] md:top-[6vh] md:translate-x-0 md:text-[clamp(4rem,8.5vw,9rem)] lg:left-[26.4vw] lg:top-[30vh] lg:text-[clamp(4rem,7.8vw,9rem)]"
          >
            {createCharacterAnimation('SKILLS. ONE')}
          </motion.h2>

          {/* STANDARD. */}
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.4,
            }}
            className="absolute left-[18vw] top-[34vh] m-0 whitespace-nowrap text-[clamp(4rem,7.8vw,9rem)] font-light leading-[0.82] tracking-[-0.07em] sm:left-[50%] sm:top-[34vh] sm:-translate-x-[8%] md:left-[50vw] md:top-[12vh] md:translate-x-0 md:text-[clamp(4rem,8.5vw,9rem)] lg:left-[50vw] lg:top-[43vh] lg:text-[clamp(4rem,7.8vw,9rem)]"
          >
            {createCharacterAnimation('STANDARD.')}
          </motion.h2>

          {/* DESCRIPTION */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.4,
            }}
            className="absolute left-1/2 top-[48vh] m-0 w-[220px] -translate-x-1/2 text-center text-[14px] font-medium uppercase leading-[0.98] tracking-[-0.035em] text-[#D8D8D8] sm:top-[48vh] md:left-1/2 md:top-[22vh] md:max-w-[250px] md:-translate-x-1/2 md:text-center lg:left-[26vw] lg:top-[54vh] lg:translate-x-0 lg:text-left"
          >
            {createWordAnimation('CREATIVITY IN MANY FORMS.')}
            <br />
            {createWordAnimation('ONE SHARED VISION.')}
          </motion.p>

          {/* CONTACT BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1 }}
            className="absolute left-0 right-0 top-[60vh] flex w-full justify-center md:top-[30vh] lg:left-auto lg:right-auto lg:top-[64vh] xl:top-[64vh] 2xl:top-[70vh]"
          >
            <AnimatedButton
              variant="animated"
              onClick={() => go('/contact', 'CONTACT')}
              borderColor="rgba(255, 255, 255, 0.8)"
              icon="right"
              charShift={78}
              charStagger={0.025}
              charDuration={0.75}
              widthClassName="w-[150px] sm:w-[150px] md:w-[150px] lg:w-[150px]"
              className="flex items-center justify-between font-mono uppercase tracking-[-0.01em]"
            >
              Contact Us
            </AnimatedButton>
          </motion.div>
        </div>

        {/* =====================================================
            LINE
        ===================================================== */}
        <div className="absolute bottom-[10vh] left-0 w-full px-6 md:bottom-[50vh] lg:bottom-[10vh]">
          <div className="mx-auto w-full max-w-[1600px]">
            {/* Mobile */}
            <div className="relative w-full md:hidden">
              <LinePlusBlock
                lineColor="#D8D8D8"
                lineOpacity={0.35}
                lineHeight={1}
                lineWidth="100%"
                lineOrigin="center"
                plusPosition="48%"
                plusSize={14}
                plusStrokeWidth={2.5}
                plusColor="#D8D8D8"
                plusOpacity={0.7}
                plusTop="3.2px"
                rotateFrom={0}
                rotateTo={360}
                scrollStart="start 98%"
                scrollEnd="start 40%"
              />
            </div>

            {/* Tablet */}
            <div className="hidden w-full md:block lg:hidden">
              <LinePlusBlock
                lineColor="#D8D8D8"
                lineOpacity={0.2}
                lineHeight={1}
                lineWidth="100%"
                lineOrigin="center"
                plusPosition="49%"
                plusSize={14}
                plusStrokeWidth={2.5}
                plusColor="#D8D8D8"
                plusOpacity={0.7}
                plusTop="3.2px"
                rotateFrom={0}
                rotateTo={360}
                scrollStart="start 97%"
                scrollEnd="start 50%"
              />
            </div>

            {/* Large desktop */}
            <div className="hidden w-full lg:block xl:hidden">
              <LinePlusBlock
                lineColor="#D8D8D8"
                lineOpacity={0.2}
                lineHeight={1}
                lineWidth="100%"
                lineOrigin="center"
                plusPosition="50%"
                plusSize={14}
                plusStrokeWidth={2.5}
                plusColor="#D8D8D8"
                plusOpacity={0.7}
                plusTop="3.2px"
                rotateFrom={0}
                rotateTo={360}
                scrollStart="start 97%"
                scrollEnd="start 20%"
              />
            </div>

            {/* XL */}
            <div className="hidden w-full xl:block 2xl:hidden">
              <LinePlusBlock
                lineColor="#D8D8D8"
                lineOpacity={0.2}
                lineHeight={1}
                lineWidth="100%"
                lineOrigin="center"
                plusPosition="49.5%"
                plusSize={14}
                plusStrokeWidth={2.5}
                plusColor="#D8D8D8"
                plusOpacity={0.7}
                plusTop="3.2px"
                rotateFrom={0}
                rotateTo={360}
                scrollStart="start 97%"
                scrollEnd="start 44%"
              />
            </div>

            {/* 2XL+ */}
            <div className="hidden w-full 2xl:block">
              <LinePlusBlock
                lineColor="#D8D8D8"
                lineOpacity={0.2}
                lineHeight={1}
                lineWidth="100%"
                lineOrigin="center"
                plusPosition="49.5%"
                plusSize={14}
                plusStrokeWidth={2.5}
                plusColor="#D8D8D8"
                plusOpacity={0.7}
                plusTop="3.2px"
                rotateFrom={0}
                rotateTo={360}
                scrollStart="start 98%"
                scrollEnd="start 30%"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DifferentSkills;
