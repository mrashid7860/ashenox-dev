'use client';

import { motion } from 'framer-motion';

import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';

import { CONTACT_COPY, CONTACT_EMAILS, CONTACT_LOCATION } from '@/data/contact.data';

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function CharacterHeading({ children, className = '', as = 'h2' }: { children: string; className?: string; as?: 'h1' | 'h2' }) {
  const Heading = as === 'h1' ? motion.h1 : motion.h2;

  return (
    <Heading
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.25,
      }}
      className={className}
    >
      {createCharacterAnimation(children)}
    </Heading>
  );
}

export function LocationJoin() {
  return (
    <section className="relative overflow-hidden bg-[#efefef] px-5 py-24 text-[#454545] md:px-10">
      <div className="mx-auto flex w-full max-w-[1220px] justify-center">
        <div className="grid w-full grid-cols-1 gap-20 text-center md:grid-cols-3 md:items-center md:justify-items-center md:gap-5">
          {/* LOCATION */}
          {/* LOCATION */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="flex w-full flex-col items-center"
          >
            <CharacterHeading className="m-0 text-[clamp(3rem,4.5vw,5rem)] font-normal leading-[0.88] tracking-[-0.05em]">Location</CharacterHeading>

            <div className="mt-12 max-w-[340px] text-center text-[14px] leading-[1.1] tracking-[-0.05em] text-[#575757] md:mt-8 md:text-[15px]">
              <div className="space-y-4">
                {CONTACT_LOCATION.addresses.map((location) => (
                  <div key={location.city}>
                    <p className="m-0 font-medium text-[#4c4c4c]">{location.city}</p>

                    <p className="m-0 mt-0">{location.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* JOIN US */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="flex w-full flex-col items-center"
          >
            <CharacterHeading className="m-0 text-[clamp(3rem,4.5vw,5rem)] font-normal leading-[0.88] tracking-[-0.05em]">Join us</CharacterHeading>

            <div className="mt-12 max-w-[270px] text-[14px] leading-[1.1] tracking-[-0.05em] text-[#5a5a5a] md:mt-8 md:text-[15px]">
              <p className="m-0">{CONTACT_COPY.joinDescription[0]}</p>

              <p className="m-0 mt-2">{CONTACT_COPY.joinDescription[1]}</p>
            </div>
          </motion.div>

          {/* CAREERS MAIL */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="flex w-full flex-col items-center"
          >
            <a href={`mailto:${CONTACT_EMAILS.careers}`} className="text-[25px] tracking-[-0.08em] text-[#4a4a4a] transition-opacity hover:opacity-50 md:text-[28px]">
              {CONTACT_EMAILS.careers}
            </a>

            <p className="mt-1 text-[14px] leading-[1.2] tracking-[-0.04em] text-[#979797] md:text-[15px]">{CONTACT_COPY.joinSubtext}</p>
          </motion.div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mx-auto mt-20 flex w-full max-w-[1220px] items-center justify-center">
        <div className="w-full">
          {/* Mobile */}
          <div className="relative w-full md:hidden">
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
          <div className="hidden w-full md:block lg:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.2}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="center"
              plusPosition="49%"
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

          {/* Large desktop */}
          <div className="hidden w-full lg:block xl:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.2}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="center"
              plusPosition="50%"
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
          <div className="hidden w-full xl:block 2xl:hidden">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.2}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="center"
              plusPosition="50.5%"
              plusSize={14}
              plusStrokeWidth={2.5}
              plusColor="#4A4A4A"
              plusOpacity={0.7}
              plusTop="3.2px"
              rotateFrom={0}
              rotateTo={360}
              scrollStart="start 97%"
              scrollEnd="start 44%"
            />
          </div>

          {/* 2XL and above */}
          <div className="hidden w-full 2xl:block">
            <LinePlusBlock
              lineColor="#4A4A4A"
              lineOpacity={0.2}
              lineHeight={1}
              lineWidth="100%"
              lineOrigin="center"
              plusPosition="49.5%"
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
    </section>
  );
}
