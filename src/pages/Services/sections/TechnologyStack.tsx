'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { technologyData, type Technology } from '@/data/technology.data';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { createWordAnimation } from '@/components/animations/wordAnimation';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';
const ease = [0.16, 1, 0.3, 1] as const;

/* ============================================================
   TECHNOLOGY COLUMN
============================================================ */

function TechnologyColumn({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="min-w-0">
      {/* Column heading */}
      <div className="mb-[15px] text-[13px] font-normal uppercase leading-none tracking-[-0.0em] text-[#999]">{heading}</div>

      {/* Column items */}
      <div className="space-y-[5px]">
        {items.map((item) => (
          <div key={item} className="text-[13px] font-light leading-[1] tracking-[-0.025em] text-[#303030]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TECHNOLOGY ACCORDION ITEM
============================================================ */

function TechnologyItem({ tech, index, isActive, onToggle }: { tech: Technology; index: number; isActive: boolean; onToggle: (index: number) => void }) {
  return (
    <div className="fab-tech-item border-t border-[#ddddda]">
      {/* =====================================================
          ACCORDION HEADER
      ===================================================== */}

      <button type="button" onClick={() => onToggle(index)} aria-expanded={isActive} className="relative flex min-h-[75px] w-full items-center text-left outline-none md:min-h-[85px]">
        {/* Number */}
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[clamp(1.5rem,1.8vw,2.65rem)] font-normal leading-none tracking-[-0.04em] text-[#383838] md:text-[28px]">{tech.number}</span>

        {/* Title */}
        <span className="ml-[12%] text-[clamp(1.2rem,1.8vw,2.65rem)] font-normal leading-none tracking-[-0.04em] text-[#343434] md:ml-[33%] md:text-[clamp(1.2rem,1.8vw,2.65rem)]">{tech.title}</span>

        {/* Arrow */}
        <span className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center">
          <motion.span
            animate={{
              rotate: isActive ? 0 : 0,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            {isActive ? <ArrowUp size={14} strokeWidth={2.5} /> : <ArrowDown size={14} strokeWidth={2.5} />}
          </motion.span>
        </span>
      </button>

      {/* =====================================================
          EXPANDED CONTENT
      ===================================================== */}

      <motion.div
        initial={false}
        animate={{
          height: isActive ? 'auto' : 0,
          opacity: isActive ? 1 : 0,
        }}
        transition={{
          height: {
            duration: 0.55,
            ease,
          },
          opacity: {
            duration: 0.3,
            ease: 'easeOut',
          },
        }}
        className="overflow-hidden"
      >
        <div className="pb-[35px]">
          <div className="ml-[12%] grid grid-cols-1 gap-x-[3vw] gap-y-[30px] pr-[5%] md:ml-[33%] md:grid-cols-2">
            {tech.columns.map((column) => (
              <TechnologyColumn key={`${tech.id}-${column.heading}`} heading={column.heading} items={column.items} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================
   TECHNOLOGY STACK
============================================================ */

export function TechnologyStack() {
  const [active, setActive] = useState(0);

  const toggleItem = (index: number) => {
    setActive(active === index ? -1 : index);
  };

  return (
    <section className="fab-tech relative w-full bg-[#fff] px-6 text-[#3f3f3f]">
      {/* =========================================================
          TOP INTRO
      ========================================================= */}

      <div className="relative w-full">
        {/* Top statement */}

        <div className="flex h-[125px] items-start justify-center pt-16 sm:h-[130px] md:h-[145px]">
          <div className="text-center text-[12px] font-normal uppercase tracking-[-0.02em] text-[#4a4a4a] md:text-[14px]">
            {/* <span className="mr-1 text-[13px] md:text-[14px]">✦</span> */}

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="text-center text-[12px] font-normal uppercase tracking-[-0.02em] text-[#4a4a4a] md:text-[14px]"
            >
              {createWordAnimation('✦ SERVICES ARE OUTPUTS. SYSTEMS ARE OUTCOMES.')}
            </motion.p>
          </div>
        </div>

        {/* Divider + center plus */}

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
              plusPosition="clamp(49%, calc(49% + (100vw - 900px) * 0.04), 52%)"
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
              lineOrigin="center"
              plusPosition="clamp(49.5%, calc(42% + (100vw - 1280px) * 0.0), 59%)"
              plusSize={14}
              plusStrokeWidth={2.5}
              plusColor="#4A4A4A"
              plusOpacity={0.7}
              plusTop="3.2px"
              rotateFrom={0}
              rotateTo={360}
              scrollStart="start 92%"
              scrollEnd="start 15%"
            />
          </div>

          {/* 2XL and above */}
          <div className="hidden 2xl:block">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.2}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="center"
              plusPosition="clamp(49.5%, calc(49% + (100vw - 1536px) * 0.035), 59%)"
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

        {/* =====================================================
            HERO TYPOGRAPHY
        ===================================================== */}

        <div className="relative h-[280px] overflow-hidden md:h-[405px]">
          {/* TECHNOLOGY */}

          {/* <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease,
            }}
            className="absolute left-0 top-[60px] w-full whitespace-nowrap text-center text-[3.5rem] font-normal leading-[0.78] tracking-[-0.055em] text-[#414141] md:left-[18%] md:top-[120px] md:w-auto md:text-left md:text-[clamp(4.5rem,8vw,9.8rem)]"
          >
            TECHNOLOGY
          </motion.h2> */}

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="absolute left-0 top-[60px] w-full whitespace-nowrap text-center text-[3.5rem] font-normal leading-[0.78] tracking-[-0.055em] text-[#414141] md:left-[18%] md:top-[120px] md:w-auto md:text-left md:text-[clamp(4.5rem,8vw,9.8rem)]"
          >
            {createCharacterAnimation('TECHNOLOGY')}
          </motion.h2>

          {/* STACK */}

          {/* <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.08,
              ease,
            }}
            className="absolute left-0 top-[115px] m-0 w-full whitespace-nowrap text-center text-[3.5rem] font-normal leading-[0.78] tracking-[-0.035em] text-[#414141] md:left-[59%] md:top-[215px] md:w-auto md:text-left md:text-[clamp(4.5rem,8vw,9.8rem)]"
          >
            STACK
          </motion.h2> */}

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="absolute left-0 top-[115px] m-0 w-full whitespace-nowrap text-center text-[3.5rem] font-normal leading-[0.78] tracking-[-0.035em] text-[#414141] md:left-[59%] md:top-[215px] md:w-auto md:text-left md:text-[clamp(4.5rem,8vw,9.8rem)]"
          >
            {createCharacterAnimation('STACK')}
          </motion.h2>

          {/* DESCRIPTION */}

          {/* <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.25,
            }}
            className="absolute top-[190px] m-0 w-full text-center text-[13px] font-normal uppercase leading-[1.05] tracking-[-0.025em] text-[#444] md:left-[25%] md:top-[232px] md:w-[260px] md:text-left lg:top-[290px]"
          >
            BUILT WITH PERFORMANCE-FIRST,
            <br />
            SCALABLE FRONT-END ARCHITECTURE.
          </motion.p> */}

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="absolute top-[190px] m-0 w-full text-center text-[13px] font-normal uppercase leading-[1.05] tracking-[-0.025em] text-[#444] md:left-[25%] md:top-[232px] md:w-[260px] md:text-left lg:top-[290px]"
          >
            {createWordAnimation('BUILT WITH PERFORMANCE-FIRST,')}
            <br />
            {createWordAnimation('SCALABLE FRONT-END ARCHITECTURE.')}
          </motion.p>
        </div>
      </div>

      {/* =========================================================
          ACCORDION
      ========================================================= */}

      <div className="pb-10 sm:px-6 md:px-6 lg:px-[1.65vw]">
        {technologyData.map((tech, index) => (
          <TechnologyItem key={tech.id} tech={tech} index={index} isActive={active === index} onToggle={toggleItem} />
        ))}

        {/* Bottom border */}

        <div className="border-t border-[#ddddda]" />
      </div>
    </section>
  );
}
