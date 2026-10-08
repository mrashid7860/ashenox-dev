'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import HowItWorks from './sections/HowItWorks';
import { TechnologyStack } from './sections/TechnologyStack';
import { ServiceCapabilities } from './sections/ServiceCapabilities';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { createWordAnimation } from '@/components/animations/wordAnimation';
import { MarqueeSection } from '@/components/common/MarqueeSection';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { AeroBackground } from '@/components/common/AeroBackground';
import { usePageTransition } from '@/components/common/PageLoader';
import { ContactFormPanel } from '@/components/common/ContactFormPanel';

// ============================================================
// AREA OF EXPERTISE
// ============================================================
function ExpertiseHero() {
  const ref = useRef<HTMLElement | null>(null);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden text-white">
      {/* Main Heading */}
      <div className="relative z-10 flex w-full -translate-y-[2svh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-[clamp(0.5rem,1.5svh,1rem)] flex items-center justify-center gap-1 text-[11px] uppercase tracking-[-0.02em] text-white/75 md:text-[14px]">
          <span>✦</span>
          <span>WHAT WE DO BEST</span>
        </div>

        <h1 className="text-[clamp(3rem,7.5vw,8.5rem)] font-light leading-[0.86] tracking-[-0.05em] md:text-[clamp(3.5rem,7.5vw,4.5rem)]">{createCharacterAnimation('Area of expertise')}</h1>
      </div>

      {/* Bottom Description */}
      <div className="absolute inset-x-0 bottom-[clamp(1.5rem,1svh,4rem)] z-10 mx-auto w-[min(270px,80vw)] text-center text-[11px] uppercase leading-[1.3] tracking-[0.02em] text-white/35 md:w-[400px] md:text-[12px]">
        <div>AI &amp; INTELLIGENT AUTOMATION WEB DEVELOPMENT &nbsp; PRODUCT DESIGN WEBSITE &amp; MOBILE DESIGN &nbsp; WORDPRESS DEVELOPMENT BRANDING</div>
      </div>
    </section>
  );
}

// ============================================================
// FOCUSED DISCIPLINES
// ============================================================

function FocusedDisciplines() {
  const ref = useRef<HTMLElement | null>(null);

  const go = usePageTransition();

  const [contactOpen, setContactOpen] = useState(false);

  const handleDiscussProject = () => {
    setContactOpen(true);
  };

  const closeContact = () => {
    setContactOpen(false);
  };

  return (
    <>
      <section ref={ref} className="relative h-[50vh] overflow-hidden text-white lg:mt-10 lg:h-[60vh]">
        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="mx-auto text-[clamp(2rem,5vw,4.5rem)] font-light leading-[0.88] tracking-[-0.075em] text-white/80 md:text-[clamp(3rem,6.8vw,4.4rem)]"
          >
            {createWordAnimation('Focused disciplines')}
            <br />
            {createWordAnimation('where strategy, design, and')}
            <br />
            {createWordAnimation('technology work as one.')}
          </motion.h2>

          {/* Buttons */}
          <motion.div className="relative z-10 mt-16 w-full text-center text-[10px] uppercase tracking-[0.03em] text-white/80">
            <div className="mx-auto flex w-full items-center justify-center gap-10 px-6 md:max-w-[400px]">
              {/* VIEW PROJECTS */}
              <AnimatedButton
                onClick={() => go('/portfolio', 'WORK')}
                variant="animated"
                borderColor="rgba(255, 255, 255, 0.8)"
                icon="right"
                charShift={55}
                charStagger={0.025}
                charDuration={0.75}
                widthClassName="w-[150px]"
                className="group relative flex items-center justify-between font-mono uppercase"
              >
                VIEW PROJECTS
              </AnimatedButton>

              {/* LET'S CONNECT */}
              <AnimatedButton
                onClick={handleDiscussProject}
                variant="animated"
                borderColor="rgba(255, 255, 255, 0.8)"
                icon="right"
                charShift={57}
                charStagger={0.025}
                charDuration={0.75}
                widthClassName="w-[150px]"
                className="group relative flex items-center justify-between font-mono uppercase"
              >
                LET'S CONNECT
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact panel OUTSIDE overflow-hidden section */}
      <ContactFormPanel open={contactOpen} onClose={closeContact} />
    </>
  );
}

function DisciplineMarquee() {
  return (
    <MarqueeSection
      words={['A.I.', 'DESIGN', 'DEVELOPMENT', 'BRANDING']}
      caption="CAPABILITIES SHAPED TO SCALE WITH AMIBITON."
      heightClass="min-h-[220px] md:h-[20vh] lg:h-[60vh]"
      textSizeClass="text-[clamp(4rem,8.5vw,7.5rem)]"
      captionPositionClass="bottom-[40%]"
    />
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export function Service() {
  return (
    <main className="overflow-x-clip">
      <section className="relative">
        {/* Background */}
        <div className="pointer-events-none sticky top-0 z-0 h-screen w-full">
          <AeroBackground />
        </div>

        {/* Content */}
        <div className="relative z-10 -mt-[100vh]">
          <ExpertiseHero />
          <FocusedDisciplines />
          <DisciplineMarquee />
        </div>
      </section>

      <ServiceCapabilities />
      <TechnologyStack />
      <HowItWorks mobileHeight="100vh" />
    </main>
  );
}
