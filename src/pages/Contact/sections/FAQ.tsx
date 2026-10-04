'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { CONTACT_COPY, CONTACT_FAQ } from '@/data/contact.data';

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

/*
 * ============================================================
 * REUSABLE CHARACTER HEADING
 * ============================================================
 */

function CharacterHeading({ children, className = '', as = 'h2' }: { children: string; className?: string; as?: 'h1' | 'h2' }) {
  const Tag = motion[as];

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.25,
      }}
      className={className}
    >
      {createCharacterAnimation(children)}
    </Tag>
  );
}

/*
 * ============================================================
 * FAQ
 * ============================================================
 */

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#efefef] px-4 pb-28 text-[#454545] md:px-10 md:pb-36">
      <div className="mx-auto max-w-[1220px]">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1fr_1.1fr] md:gap-20">
          {/* LEFT */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="flex flex-col items-center md:items-start"
          >
            <CharacterHeading className="mt-1 text-center text-[clamp(3rem,4.5vw,5rem)] font-normal leading-[0.86] tracking-[-0.05em] md:text-left">Questions</CharacterHeading>

            <p className="mt-6 max-w-[210px] text-center text-[14px] leading-[1.1] tracking-[-0.05em] text-[#5c5c5c] md:mt-8 md:text-left md:text-[15px]">
              {CONTACT_COPY.faqDescription[0]}
              <br />
              {CONTACT_COPY.faqDescription[1]}
            </p>
          </motion.div>

          {/* RIGHT */}

          <div>
            {CONTACT_FAQ.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={item.question}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b border-[#c8c8c8]"
                >
                  <button type="button" onClick={() => setOpenIndex(isOpen ? -1 : index)} className="group flex w-full items-start justify-between gap-8 py-5 text-left" aria-expanded={isOpen}>
                    <span className="max-w-[820px] text-[clamp(1.4rem,1.8vw,2.5rem)] font-normal leading-[1] tracking-[-0.055em] text-[#3e3e3e]">{item.question}</span>

                    <span className={`mt-1 shrink-0 text-[15px] transition-transform duration-300 ${isOpen ? '-translate-y-[1px]' : ''}`}>{isOpen ? '↑' : '↓'}</span>
                  </button>

                  <div className={`duration-400 grid transition-[grid-template-rows,opacity] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-[720px] pb-5 pr-12 text-[14px] leading-[1.35] tracking-[-0.02em] text-[#696969] md:pb-6 md:text-[15px]">{item.answer}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
