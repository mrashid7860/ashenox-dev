import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Globe2 } from 'lucide-react';
import { AboutValues } from '@/pages/About/sections/AboutValues';
import HowItWorks from '@/pages/Services/sections/HowItWorks';
import { Founder } from '@/pages/About/sections/Founder';
import DifferentSkills from '@/pages/About/sections/DifferentSkills';
import AwardsRecognition from './sections/AwardsRecognition';
import { ClientStories } from '@/components/common/ClientStories';
import { BrandsSection } from '@/pages/About/sections/BrandsSection';

import { createWordAnimation } from '@/components/animations/wordAnimation';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { MarqueeSection } from '@/components/common/MarqueeSection';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';
import { ContactFormPanel } from '@/components/navigation/ContactFormPanel';
import { MoltenMetalBackground } from '@/components/common/MoltenMetalBackground';
function AboutHero() {
  const { scrollY } = useScroll();

  const scrollIndicatorOpacity = useTransform(scrollY, [0, 180], [1, 0]);

  return (
    <div className="relative flex min-h-[1100px] w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat md:min-h-[1400px]">
      {/* =====================================================
          MAIN HEADING
      ===================================================== */}

      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.4,
        }}
        className="absolute top-[20%] z-20 ml-10 mr-10 w-[calc(90%)] text-center text-[clamp(2.7rem,4vw,4rem)] font-normal leading-[0.9] tracking-[-0.06em] text-[#ffffff] mix-blend-difference md:top-[145px] md:w-[70%] md:text-[clamp(3.8rem,4vw,5rem)] lg:top-[80px]"
      >
        {createWordAnimation('We are an independent creative digital studio built on bold ideas, thoughtful design, meaningful experiences, and lasting partnerships.')}
        {/* <AnimatedWords text={'We are an independent creative digital studio built on bold ideas, thoughtful design, meaningful experiences, and lasting partnerships.'} /> */}
      </motion.h1>
      {/* =====================================================
          CENTER SMALL TEXT
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
          delay: 0.35,
        }}
        className="absolute top-[calc(87vh)] z-40 w-[220px] text-center text-[13px] font-medium uppercase leading-[1.25] tracking-[-0.01em] text-white md:top-[450px] md:w-[180px] md:w-[270px] md:text-[15px] lg:top-[400px] lg:w-[250px] lg:text-[14px]"
      >
        AT THE INTERSECTION OF CREATIVITY, DESIGN, TECHNOLOGY, AND IMPACT.
      </motion.div>

      {/* =====================================================
          LEFT DESCRIPTION
      ===================================================== */}

      {/* <div className="absolute left-[10%] top-[850px] z-30 hidden w-[270px] text-[13px] uppercase leading-[1] tracking-[0.02em] text-white md:block">
        {createWordAnimation('WE DESIGN AND BUILD DIGITAL')}
        <br />
        {createWordAnimation('EXPERIENCES THAT SCALE,')}
        <br />
        {createWordAnimation('PERFORM, AND ENDURE.')}
      </div> */}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.4,
        }}
        className="absolute left-[10%] top-[850px] z-30 hidden w-[270px] text-[13px] uppercase leading-[1] tracking-[0.02em] text-white md:block"
      >
        {createWordAnimation('WE BUILD BRANDS, WEBSITES,')}
        <br />
        {createWordAnimation('AND DIGITAL EXPERIENCES THAT')}
        <br />
        {createWordAnimation('STAND OUT, PERFORM, AND GROW.')}
      </motion.div>

      {/* =====================================================
          RIGHT DESCRIPTION
      ===================================================== */}

      <motion.div
        initial="hidden"
        animate="visible"
        className="absolute right-[1%] z-30 hidden w-[170px] text-[13px] uppercase leading-[1] tracking-[0.02em] text-[#fff] md:top-[580px] md:block xl:top-[calc(100dvh-75px)] 2xl:top-[calc(100dvh-80px)]"
      >
        {createWordAnimation('TURNING BOLD IDEAS INTO CLEAR, CREATIVE, AND MEANINGFUL DIGITAL EXPERIENCES')}
      </motion.div>

      {/* =====================================================
          MOVING TEXT
      ===================================================== */}

      <div className="pointer-events-none absolute left-0 top-[calc(122vh)] z-40 w-full overflow-hidden md:top-[1150px] lg:top-[1100px]">
        <MarqueeSection
          words={['CREATE', 'INNOVATE', 'IMPACT']}
          heightClass="h-[220px]"
          // topClass="top-[calc(112vh)] md:top-[1150px] lg:top-[1000px]"
          textSizeClass="text-[clamp(5.5rem,9vw,10rem)]"
          duration={20}
          translateX="-30%"
          plusSizeClass="md:h-[80px] h-[40px] md:w-[80px] w-[40px]"
          plusSpacingClass="mx-10"
          // plusColorClass="text-[#e8e8e8]"
          plusMarginTopClass="mt-0"
        />
      </div>

      {/* =====================================================
          SCROLL DOT
      ===================================================== */}

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
        className="pointer-events-none absolute left-[3%] top-[calc(88.5vh)] flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-white md:left-[49%] md:top-[75%] lg:left-[2%] lg:top-[41%] xl:top-[calc(100dvh-42px)] 2xl:top-[calc(100dvh-45px)]"
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
          className="absolute left-[2px] flex items-center justify-center"
        >
          <ArrowDown size={10} strokeWidth={1.2} className="shrink-0 text-white" stroke="white" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* =========================================================
   ABOUT INTRO
========================================================= */

function AboutIntro() {
  const [contactOpen, setContactOpen] = useState(false);

  // ============================================================
  // CONTACT
  // ============================================================

  const handleDiscussProject = () => {
    setContactOpen(true);
  };

  const closeContact = () => {
    setContactOpen(false);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#eeeeee] text-[#272727]">
      <div className="mx-auto mt-10 h-[600px] w-full max-w-full px-4 md:h-[500px] md:px-1 lg:h-full lg:px-8">
        {/* =====================================================
            TITLE
        ===================================================== */}

        <div className="grid grid-cols-12 gap-x-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="col-span-12 md:col-span-10 md:col-start-2"
          >
            <p className="mb-3 text-[13px] uppercase tracking-[-0.01em] md:mb-2"> {createCharacterAnimation('AT ASHENOX,')}</p>

            <p className="max-w-[500px] text-[clamp(1.4rem,1.2vw,2rem)] leading-[0.9] tracking-[-0.07em] md:max-w-[400px] md:text-[clamp(1.4rem,1.2vw,2rem)] md:leading-[0.94]">
              the right creative minds together for every project. Designers, developers, content creators, and specialists collaborate to turn ideas into meaningful brands and digital experiences.
            </p>
          </motion.div>
        </div>

        {/* =====================================================
            LINE + PLUS
        ===================================================== */}

        <div className="my-[60px] grid grid-cols-12 gap-x-6 md:my-[65px] lg:my-[70px]">
          <div className="relative col-span-12 md:col-span-10 md:col-start-2">
            {/* <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#272727]/15" />

            <motion.div
              initial={{
                opacity: 0,
                rotate: 0,
                scale: 0.5,
              }}
              whileInView={{
                opacity: 1,
                rotate: 180,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative left-[50%] z-10 flex h-4 w-4 items-center justify-center md:left-[51%] lg:left-[68%]"
            >
              <Plus size={14} strokeWidth={1} />
            </motion.div> */}

            <div className="">
              <div className="relative md:hidden">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.35}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="center"
                  plusPosition="48%"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#4A4A4A"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 98%"
                  scrollEnd="start 40%"
                />
              </div>
              {/* Tablet */}
              <div className="hidden md:block lg:hidden">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="center"
                  plusPosition="clamp(51%, calc(49% + (100vw - 900px) * 0.04), 52%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#4A4A4A"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 94%"
                  scrollEnd="start 50%"
                />
              </div>

              {/* Large desktop */}
              <div className="hidden lg:block xl:hidden">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="center"
                  plusPosition="clamp(49%, calc(49% + (100vw - 900px) * 0.04), 52%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#4A4A4A"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 97%"
                  scrollEnd="start 20%"
                />
              </div>

              {/* XL */}
              <div className="hidden xl:block 2xl:hidden">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(68%, calc(68% + (100vw - 1280px) * 0.02), 70%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#4A4A4A"
                  plusOpacity={0.7}
                  plusTop="3.2px"
                  rotateFrom={0}
                  rotateTo={360}
                  scrollStart="start 97%"
                  scrollEnd="start 50%"
                />
              </div>

              {/* 2XL and above */}
              <div className="hidden 2xl:block">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
                  plusPosition="clamp(68.3%, calc(49% + (100vw - 1536px) * 0.035), 59%)"
                  plusSize={14}
                  plusStrokeWidth={2.5}
                  plusColor="#4A4A4A"
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

        {/* =====================================================
            EXPERIENCE + DESCRIPTION
         ===================================================== */}
        <div className="grid grid-cols-12 justify-items-center gap-x-6 md:justify-items-stretch">
          {/* EXPERIENCE */}
          <motion.div
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
            }}
            transition={{
              duration: 0.8,
            }}
            className="col-span-12 mx-auto mt-1 md:col-span-4 md:col-start-2 md:mx-0"
          >
            <div className="flex h-[62px] max-w-[215px] overflow-hidden rounded border border-[#272727]">
              <div className="flex min-w-[75px] flex-col items-center justify-center gap-2 bg-[#3d3d3d] px-4 text-center text-white">
                <Globe2 size={27} strokeWidth={1.2} className="text-white" />

                <span className="text-[8px] uppercase tracking-[0.08em]">EST. 2024</span>
              </div>

              <div className="flex flex-1 items-center px-5 py-5">
                <span className="text-[10px] uppercase leading-[1.25] tracking-[-0.01em] text-[#444] md:text-[11px]">
                  3+ YEARS SHAPING
                  <br />
                  DIGITAL DIRECTION
                </span>
              </div>
            </div>
          </motion.div>

          {/* DESCRIPTION */}
          <motion.div
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
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="col-span-12 mx-auto mb-28 mt-10 max-w-[290px] text-center md:col-span-4 md:col-start-7 md:mx-0 md:mt-0 md:max-w-[290px] md:text-left lg:col-span-6 lg:col-start-9"
          >
            <p className="text-[15px] leading-[1.2] tracking-[-0.04em] text-[#666] md:text-[16px]">
              We&apos;ve grown through experimentation, creativity, and continuous learning, building a practice grounded in clarity, craft, and meaningful impact.
            </p>

            <p className="mt-5 text-[15px] leading-[1.2] tracking-[-0.04em] text-[#666] md:text-[16px]">
              Today, Ashenox works across brands, websites, digital experiences, content, and creative solutions—helping businesses turn ideas into work that connects, performs, and lasts.
            </p>

            <AnimatedButton
              onClick={handleDiscussProject}
              variant="animated"
              textColor="#4A4A4A"
              hoverTextColor="#000"
              borderColor="#4A4A4A"
              hoverBorderColor="#000"
              iconColor="#4A4A4A"
              icon="up-right"
              hoverIconColor="#000"
              charShift={57}
              charStagger={0.025}
              charDuration={0.75}
              widthClassName="w-[150px] sm:w-[150px] md:w-[150px] lg:w-[150px]"
              className="group relative mx-auto mt-10 inline-flex items-center justify-between font-mono uppercase"
            >
              LET&apos;S CONNECT
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
      <ContactFormPanel open={contactOpen} onClose={closeContact} />
    </section>
  );
}

/* =========================================================
   ABOUT
========================================================= */

export function About() {
  return (
    <main className="overflow-x-clip">
      <section id="about" className="relative w-full text-[#2d2d2d]">
        {/* =====================================================
            FIXED / STICKY BACKGROUND AREA
        ===================================================== */}
        <div className="relative">
          {/* Background stays fixed while Hero + Intro pass over it */}
          <div className="pointer-events-none sticky top-0 z-0 h-screen w-full">
            <MoltenMetalBackground />
          </div>

          {/* =================================================
              HERO + INTRO CONTENT
          ================================================= */}
          <div className="relative z-10 -mt-[100vh]">
            <AboutHero />
          </div>
        </div>

        {/* =====================================================
            REST OF ABOUT PAGE
        ===================================================== */}
        <div className="relative z-20 bg-white">
          <AboutIntro />
          <AboutValues />
          <HowItWorks mobileSticky mobileHeight="200vh" theme="dark" />
          <Founder />
          <DifferentSkills />
          <AwardsRecognition />
          <BrandsSection />
          <ClientStories />
        </div>
      </section>
    </main>
  );
}
