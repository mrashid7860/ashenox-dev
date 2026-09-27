'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

import hangingLion from '@/assets/video/Sequence 06_2.mp4';
import formBackgroundVideo from '@/assets/video/form-background-video.mp4';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';

import { CONTACT_BUDGETS, CONTACT_COPY, CONTACT_EMAILS, CONTACT_FAQ, CONTACT_LOCATION, CONTACT_SERVICES } from '@/data/contact.data';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { SplitTextHover } from '@/components/animations/SplitTextHover';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';
/*
 * ============================================================
 * ANIMATION
 * ============================================================
 */

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
 * CONTACT HERO
 * ============================================================
 */

function ContactHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#d7d7d7] text-[#454545]">
      {/* ==================================================
          LION VIDEO — full-screen, behind all text
      ================================================== */}

      <motion.div
        initial={{
          y: -180,
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.25,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-0 z-0 mix-blend-darken"
      >
        <video src={hangingLion} autoPlay muted loop playsInline preload="auto" controls={false} className="h-full w-full select-none object-cover object-top" />
      </motion.div>

      {/* ==================================================
          CONTENT — sits above the video
      ================================================== */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] flex-col items-center justify-center px-5 pb-16 pt-0 text-center md:px-10">
        {/* TITLE */}

        <CharacterHeading as="h1" className="relative z-20 max-w-[1100px] text-[clamp(3rem,5.2vw,5rem)] font-normal leading-[0.9] tracking-[-0.075em] text-[#fff]">
          {CONTACT_COPY.heroTitle}
        </CharacterHeading>

        {/* DESCRIPTION */}

        <motion.p
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
            delay: 0.68,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-20 mt-5 max-w-[380px] text-[13px] leading-[1.2] tracking-[-0.03em] text-[#fff] md:mt-4 md:max-w-[430px] md:text-[14px]"
        >
          {CONTACT_COPY.heroDescription[0]}
          <br />
          {CONTACT_COPY.heroDescription[1]}
        </motion.p>

        {/* SCROLL INDICATOR */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 1,
          }}
          className="absolute bottom-10 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border border-[#707070]/70"
        >
          <motion.div
            animate={{
              y: ['-180%', '0%', '0%', '180%'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.6,
              times: [0, 0.4, 0.65, 1],
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute flex items-center justify-center"
          >
            <ArrowDown size={10} strokeWidth={1.2} className="shrink-0 text-[#707070]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/*
 * ============================================================
 * SELECT FIELD
 * ============================================================
 */

function ContactSelect({
  name,
  value,
  onChange,
  placeholder,
  options,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-[52px] w-full appearance-none rounded border border-white/[0.18] bg-transparent px-4 text-[13px] text-white/50 outline-none focus:border-white/40 md:h-[40px] md:text-[14px]"
    >
      <option value="" disabled className="bg-[#111214]">
        {placeholder}
      </option>

      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-[#111214] text-white">
          {option.label}
        </option>
      ))}
    </select>
  );
}

/*
 * ============================================================
 * CONTACT INPUT
 * ============================================================
 */

function ContactInput({ type, name, placeholder }: { type: 'text' | 'email'; name: string; placeholder: string }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="h-[52px] w-full rounded border border-white/[0.18] bg-transparent px-4 text-[13px] text-white outline-none placeholder:text-white/50 focus:border-white/40 md:h-[40px] md:text-[14px]"
    />
  );
}

/*
 * ============================================================
 * CONTACT FORM
 * ============================================================
 */

function ContactForm() {
  const [service, setService] = useState('');
  const [budget, setBudget] = useState('');

  return (
    <section id="contact-form" className="relative overflow-hidden bg-[#090a0b] px-4 py-20 text-white md:px-10 md:py-28">
      {/* ==================================================
          BACKGROUND VIDEO
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video src={formBackgroundVideo} autoPlay muted loop playsInline preload="auto" controls={false} className="h-full w-full object-cover" />

        <div className="absolute inset-0 bg-black/65" />

        <div className="absolute left-1/2 top-[35%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[130px]" />
      </div>

      {/* CONTENT */}

      <div className="relative z-10 mx-auto max-w-[1050px]">
        {/* EYEBROW */}

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="text-center text-[12px] font-medium uppercase leading-[1.15] tracking-[-0.02em] text-white/80 md:text-[13px]"
        >
          {createCharacterAnimation(CONTACT_COPY.formEyebrow[0])}
          <br />
          {createCharacterAnimation(CONTACT_COPY.formEyebrow[1])}
        </motion.p>

        {/* TITLE */}

        <CharacterHeading className="mt-5 text-center text-[clamp(3rem,4vw,4rem)] font-normal leading-[0.86] tracking-[-0.05em] text-white/90 md:text-[clamp(3.3rem,4.5vw,6rem)]">
          {CONTACT_COPY.formTitle}
        </CharacterHeading>

        {/* SUBTITLE */}

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            delay: 0.08,
          }}
          className="mx-auto mt-5 max-w-[330px] text-center text-[14px] leading-[1.1] tracking-[-0.04em] text-white/65 md:text-[15px]"
        >
          {CONTACT_COPY.formDescription[0]}
          <br />
          {CONTACT_COPY.formDescription[1]}
        </motion.p>

        {/* FORM */}

        <motion.form
          initial={{
            opacity: 0,
            y: 40,
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
            duration: 1,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mt-16 w-full max-w-[820px] md:mt-20"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          {/* ROW 1 */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ContactInput type="text" name="name" placeholder="Full Name" />

            <ContactInput type="email" name="email" placeholder="Email address" />
          </div>

          {/* ROW 2 */}

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <ContactInput type="text" name="company" placeholder="Company / Website name" />

            <ContactSelect name="service" value={service} onChange={setService} placeholder="Select a service" options={CONTACT_SERVICES} />
          </div>

          {/* MESSAGE */}

          <textarea
            name="message"
            placeholder="Share a little about your goals, timeline, and requirements..."
            rows={4}
            className="mt-5 min-h-[120px] w-full resize-none rounded border border-white/[0.18] bg-transparent px-4 py-1 text-[13px] text-white outline-none placeholder:text-white/50 focus:border-white/40 md:min-h-[80px] md:text-[14px]"
          />

          {/* BUDGET + SEND */}

          <div className="mt-4 grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_180px] md:gap-20">
            <ContactSelect name="budget" value={budget} onChange={setBudget} placeholder="Select your estimated budget" options={CONTACT_BUDGETS} />

            <button
              type="submit"
              className="group flex h-[38px] w-full items-center justify-between rounded border border-black/60 bg-white px-4 text-left text-[12px] uppercase tracking-[-0.01em] text-black/80 transition-all duration-300 hover:border-white/40 hover:bg-transparent hover:text-white/50"
            >
              <span>Send Inquiry</span>

              <ArrowRight size={14} strokeWidth={1.4} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* <AnimatedButton
              variant="animated"

              icon="right"
              charShift={84}
              charStagger={0.025}
              charDuration={0.75}
              widthClassName="w-[127px] sm:w-[150px] md:w-[165px] lg:w-[170px]"
              className="group flex items-center gap-3 font-mono uppercase"
            >
              Send Inquiry
            </AnimatedButton> */}
          </div>
        </motion.form>

        {/* EMAIL */}

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="mt-16 text-center text-[14px] text-white/55 md:mt-16"
        >
          Prefer email?{' '}
          <a href={`mailto:${CONTACT_EMAILS.general}`} className="tracking-[-0.07em] text-white/75">
            <SplitTextHover text={CONTACT_EMAILS.general} />
          </a>
        </motion.p>
      </div>
    </section>
  );
}

/*
 * ============================================================
 * LOCATION / JOIN US
 * ============================================================
 */

function LocationJoin() {
  return (
    <section className="relative overflow-hidden bg-[#efefef] px-5 py-24 text-[#454545] md:px-10">
      <div className="mx-auto max-w-[1220px]">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2 md:gap-5">
          {/* LOCATION */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
          >
            <CharacterHeading className="m-0 text-[clamp(3rem,4.5vw,5rem)] font-normal leading-[0.88] tracking-[-0.05em]">Location</CharacterHeading>

            <div className="mt-12 max-w-[340px] text-[14px] leading-[1.1] tracking-[-0.05em] text-[#575757] md:mt-8 md:text-[15px]">
              <p className="m-0 font-medium text-[#4c4c4c]">{CONTACT_LOCATION.company}</p>

              {CONTACT_LOCATION.address.map((line) => (
                <p key={line} className="m-0">
                  {line}
                </p>
              ))}
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
            className="relative"
          >
            <CharacterHeading className="m-0 text-[clamp(3rem,4.5vw,5rem)] font-normal leading-[0.88] tracking-[-0.05em]">Join us</CharacterHeading>

            <div className="mt-12 flex flex-col gap-14 md:mt-8 md:flex-row md:items-start md:justify-between md:gap-10">
              <div className="max-w-[270px] text-[14px] leading-[1.1] tracking-[-0.05em] text-[#5a5a5a] md:text-[15px]">
                <p className="m-0">{CONTACT_COPY.joinDescription[0]}</p>

                <p className="m-0 mt-2">{CONTACT_COPY.joinDescription[1]}</p>
              </div>

              <div className="md:pt-0">
                <a href={`mailto:${CONTACT_EMAILS.careers}`} className="text-[25px] tracking-[-0.08em] text-[#4a4a4a] transition-opacity hover:opacity-50 md:text-[28px]">
                  {CONTACT_EMAILS.careers}
                </a>

                <p className="mt-1 text-[14px] leading-[1.2] tracking-[-0.04em] text-[#979797] md:text-[15px]">{CONTACT_COPY.joinSubtext}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* DIVIDER */}

        <div className="mx-auto mt-20 flex items-center justify-center">
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
                plusPosition="49.5%"
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
      </div>
    </section>
  );
}

/*
 * ============================================================
 * FAQ
 * ============================================================
 */

function FAQ() {
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
          >
            <CharacterHeading className="mt-1 text-[clamp(3rem,4.5vw,5rem)] font-normal leading-[0.86] tracking-[-0.05em]">Questions</CharacterHeading>

            <p className="mt-6 max-w-[210px] text-[14px] leading-[1.1] tracking-[-0.05em] text-[#5c5c5c] md:mt-8 md:text-[15px]">
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
                    <span className="max-w-[820px] text-[clamp(1rem,1.8vw,2rem)] font-normal leading-[1] tracking-[-0.055em] text-[#3e3e3e]">{item.question}</span>

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

/*
 * ============================================================
 * MAIN CONTACT
 * ============================================================
 */

export function Contact() {
  return (
    <main id="contact">
      <ContactHero />
      <ContactForm />
      <LocationJoin />
      <FAQ />
    </main>
  );
}

export default Contact;
