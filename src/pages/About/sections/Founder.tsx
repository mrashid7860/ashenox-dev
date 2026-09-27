'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FounderImg from '@/assets/img/founder.png';
import FounderMobileImg from '@/assets/img/founder-mobile.png';
import { Plus } from 'lucide-react';
import { createCharacterAnimation } from '@/components/animations/CharAnimation';
import { LinePlusBlock } from '@/components/common/LinePlusBlock';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Splits a string into word-wrapper spans containing per-char spans,
 * matching the .words > .chars structure baked into the reference markup.
 */
const splitChars = (text: string, keyPrefix: string) =>
  text.split(' ').map((word, wi) => (
    <span key={`${keyPrefix}-w-${wi}`} className="word mr-[0.2em] inline-block overflow-visible whitespace-nowrap align-top">
      {word.split('').map((ch, ci) => (
        <span key={`${keyPrefix}-c-${wi}-${ci}`} className="char inline-block will-change-transform">
          {ch}
        </span>
      ))}
    </span>
  ));

export function Founder() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const awardsRef = useRef<HTMLSpanElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const smallRef = useRef<HTMLParagraphElement>(null);
  const beliefRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(nameRef.current!.querySelectorAll('.char'), {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      // --- Awwwards jury blurb (desktop) char reveal ---
      gsap.from(awardsRef.current!.querySelectorAll('.char'), {
        yPercent: 110,
        opacity: 0,
        duration: 0.7,
        stagger: 0.015,
        ease: 'power3.out',
        scrollTrigger: { trigger: awardsRef.current, start: 'top 90%' },
      });

      // --- Bio paragraph fade-up (translateY 20px -> 0, opacity 0 -> 1) ---
      gsap.from(bioRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: bioRef.current, start: 'top 92%' },
      });

      // --- Decorative crosshair line (width 0% -> 100%, expands from center) ---
      gsap.fromTo(
        lineRef.current,
        { width: '0%' },
        {
          width: '100%',
          duration: 1.1,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: lineRef.current, start: 'top 85%' },
        }
      );

      // --- QUOTE: scrub-linked char fill (the main scroll "text effect") ---
      // Starts at rgba(245,241,232,0.1) — baked into the initial style below —
      // and brightens per-character as the quote scrolls through the viewport.
      const quoteChars = quoteRef.current!.querySelectorAll('.char');
      gsap.to(quoteChars, {
        color: 'rgba(245,241,232,1)',
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 85%',
          end: 'bottom 45%',
          scrub: 0.6,
        },
      });

      // --- Small "Recognized by..." fade-up ---
      gsap.from(smallRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: smallRef.current, start: 'top 92%' },
      });

      // --- "This belief shapes..." blur-in reveal ---
      gsap.from(beliefRef.current!.querySelectorAll('.word'), {
        opacity: 0,
        filter: 'blur(12px)',
        y: 8,
        duration: 1,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: { trigger: beliefRef.current, start: 'top 90%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[30] -mt-[90vh] min-h-[190vh] w-full overflow-hidden bg-[#050609] text-[#F5F1E8] md:-mt-[90vh] md:min-h-[150vh] lg:min-h-[190vh]">
      {/* =====================================================
        FOUNDER BACKGROUND IMAGE
        ===================================================== */}

      <div ref={bgRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        {/* =================================================
    MOBILE
    < 640px
    ================================================= */}
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat sm:hidden"
          style={{
            backgroundImage: `url(${FounderMobileImg})`,
            backgroundPosition: 'center top',
            backgroundSize: '100% auto',
          }}
        />

        {/* =================================================
    SMALL TABLET
    640px - 767px
    ================================================= */}
        <div
          className="absolute inset-0 hidden bg-top bg-no-repeat sm:block md:hidden"
          style={{
            backgroundImage: `url(${FounderImg})`,
            backgroundPosition: 'center top',
            backgroundSize: 'auto 60%',
          }}
        />

        {/* =================================================
    TABLET
    768px - 1023px
    ================================================= */}
        <div
          className="absolute inset-0 hidden bg-top bg-no-repeat md:block lg:hidden"
          style={{
            backgroundImage: `url(${FounderImg})`,
            backgroundPosition: 'center top',
            backgroundSize: 'auto 60%',
          }}
        />

        {/* =================================================
    SMALL LAPTOP
    1024px - 1279px
    IMPORTANT:
    Don't stretch image to 100% width
    ================================================= */}
        <div
          className="absolute inset-0 hidden bg-center bg-no-repeat lg:block xl:hidden"
          style={{
            backgroundImage: `url(${FounderImg})`,
            backgroundPosition: 'center center',
            backgroundSize: 'auto 100%',
          }}
        />

        {/* =================================================
    LAPTOP
    1280px - 1535px
    ================================================= */}
        <div
          className="absolute inset-0 hidden bg-center bg-no-repeat xl:block 2xl:hidden"
          style={{
            backgroundImage: `url(${FounderImg})`,
            backgroundPosition: 'center center',
            backgroundSize: 'auto 100%',
          }}
        />

        {/* =================================================
    LARGE DESKTOP
    1536px+
    ================================================= */}
        <div
          className="absolute inset-0 hidden bg-center bg-no-repeat 2xl:block"
          style={{
            backgroundImage: `url(${FounderImg})`,
            backgroundPosition: 'center center',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      {/* =====================================================
        DARK OVERLAY
        ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/10 via-transparent to-black/30" />

      {/* =====================================================
        CONTENT
        ===================================================== */}

      <div className="tr__container relative z-10 mx-auto h-full max-w-full md:px-6">
        {/* ===================================================
          TITLE BLOCK
          =================================================== */}

        <div className="title-block relative grid grid-cols-12">
          {/* NAME */}
          <div className="col-span-8 lg:col-start-2">
            <div className="relative top-[60px] px-6 md:top-[70px] md:px-0 lg:top-[150px] xl:top-[90px] 2xl:top-[150px]">
              <h2
                ref={nameRef}
                className="text-light-font mb-0 text-[30px] leading-none tracking-[-0.025em] text-white/80 md:mb-2 md:mb-3 md:text-[50px] lg:mb-2 lg:mb-6 lg:text-[65px] xl:text-[65px]"
              >
                {createCharacterAnimation('Ashish Behera')}
              </h2>

              <h3 className="text-[18px] text-[#F5F1E8]/60 md:text-[20px] md:text-base lg:text-[25px]">Founder &amp; CEO</h3>
            </div>
          </div>

          {/* AWARDS */}
          <div className="col-span-4 flex justify-start">
            <div className="relative top-[60px] flex flex-col items-end gap-1 md:left-[20%] md:top-[240px] md:items-start md:gap-3 lg:left-[240%] lg:top-[240px]">
              <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/sunnyrathod/" className="inline-block transition-opacity duration-300 ease-in-out hover:opacity-80">
                <svg width="29" height="29" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[29px] w-[29px]">
                  <rect width="39" height="39" rx="4" fill="black" />

                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.4616 17.0402C16.4616 16.4879 16.9093 16.0402 17.4616 16.0402H19.3167C19.869 16.0402 20.3167 16.4879 20.3167 17.0402V18.0159C20.3167 18.0349 20.3321 18.0503 20.351 18.0503C20.3635 18.0503 20.375 18.0436 20.3811 18.0327C20.9257 17.063 22.2324 16.0402 24.1793 16.0402C28.2478 16.0402 29 18.603 29 21.9372V27.9874C29 28.5397 28.5523 28.9874 28 28.9874H25.9811C25.4288 28.9874 24.9811 28.5397 24.9811 27.9874V22.7211C24.9811 21.2864 24.9513 19.4397 22.8909 19.4397C20.8305 19.4397 20.4781 21 20.4781 22.6181V28C20.4781 28.5523 20.0305 29 19.4781 29H17.4616C16.9093 29 16.4616 28.5523 16.4616 28V17.0402ZM14.1803 12.1156C14.1803 12.534 14.0577 12.943 13.828 13.2909C13.5984 13.6388 13.2719 13.91 12.89 14.0701C12.5081 14.2302 12.0878 14.2721 11.6824 14.1905C11.2769 14.1089 10.9045 13.9074 10.6122 13.6115C10.3199 13.3156 10.1208 12.9387 10.0402 12.5283C9.95951 12.1179 10.0009 11.6926 10.1591 11.306C10.3173 10.9194 10.5852 10.589 10.9289 10.3565C11.2726 10.1241 11.6768 10 12.0901 10C12.6443 10.0007 13.1755 10.2238 13.5674 10.6204C13.9592 11.017 14.1796 11.5547 14.1803 12.1156ZM10.005 17.0402C10.005 16.4879 10.4527 16.0402 11.005 16.0402H13.1803C13.7326 16.0402 14.1803 16.4879 14.1803 17.0402V27.9874C14.1803 28.5397 13.7326 28.9874 13.1803 28.9874H11.005C10.4527 28.9874 10.005 28.5397 10.005 27.9874V17.0402Z"
                    fill="white"
                  />
                </svg>
              </a>

              <span ref={awardsRef} className="title hidden w-[190px] text-[13px] uppercase leading-[1.1] md:block">
                {splitChars('Awwwards Jury, shaping digital experiences for global brands.', 'awards-desktop')}
              </span>

              <span className="title block w-[110px] text-right text-sm uppercase md:hidden">{splitChars('Awwwards', 'awards-mobile')}</span>
              <span className="title -mt-3 block w-[110px] text-right text-sm uppercase md:hidden">{splitChars('Jury', 'awards-mobile')}</span>
            </div>
          </div>
        </div>

        {/* ===================================================
          LINKEDIN + BIO
          =================================================== */}

        <div className="absolute top-[278%] z-20 w-[50%] px-6 md:left-[4%] md:top-[450%] md:px-0 lg:left-[10%] lg:top-[310%] lg:px-0">
          <div className="md:mb-2">
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/sunnyrathod/" className="inline-block transition-opacity duration-300 ease-in-out hover:opacity-80">
              <svg width="29" height="29" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[29px] w-[29px]">
                <rect width="39" height="39" rx="4" fill="black" />

                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.4616 17.0402C16.4616 16.4879 16.9093 16.0402 17.4616 16.0402H19.3167C19.869 16.0402 20.3167 16.4879 20.3167 17.0402V18.0159C20.3167 18.0349 20.3321 18.0503 20.351 18.0503C20.3635 18.0503 20.375 18.0436 20.3811 18.0327C20.9257 17.063 22.2324 16.0402 24.1793 16.0402C28.2478 16.0402 29 18.603 29 21.9372V27.9874C29 28.5397 28.5523 28.9874 28 28.9874H25.9811C25.4288 28.9874 24.9811 28.5397 24.9811 27.9874V22.7211C24.9811 21.2864 24.9513 19.4397 22.8909 19.4397C20.8305 19.4397 20.4781 21 20.4781 22.6181V28C20.4781 28.5523 20.0305 29 19.4781 29H17.4616C16.9093 29 16.4616 28.5523 16.4616 28V17.0402ZM14.1803 12.1156C14.1803 12.534 14.0577 12.943 13.828 13.2909C13.5984 13.6388 13.2719 13.91 12.89 14.0701C12.5081 14.2302 12.0878 14.2721 11.6824 14.1905C11.2769 14.1089 10.9045 13.9074 10.6122 13.6115C10.3199 13.3156 10.1208 12.9387 10.0402 12.5283C9.95951 12.1179 10.0009 11.6926 10.1591 11.306C10.3173 10.9194 10.5852 10.589 10.9289 10.3565C11.2726 10.1241 11.6768 10 12.0901 10C12.6443 10.0007 13.1755 10.2238 13.5674 10.6204C13.9592 11.017 14.1796 11.5547 14.1803 12.1156ZM10.005 17.0402C10.005 16.4879 10.4527 16.0402 11.005 16.0402H13.1803C13.7326 16.0402 14.1803 16.4879 14.1803 17.0402V27.9874C14.1803 28.5397 13.7326 28.9874 13.1803 28.9874H11.005C10.4527 28.9874 10.005 28.5397 10.005 27.9874V17.0402Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>

          <div className="w-[260px] md:max-w-60">
            <p ref={bioRef} className="leading-[1.1] text-[#F5F1E8]/90 md:text-[14px] lg:text-[15px]">
              Award-winning designer &amp; Founder of Trionn® with 27+ yrs of experience in UI/UX, web, and brand systems.
            </p>
          </div>
        </div>

        {/* ===================================================
          CROSSHAIR
          =================================================== */}

        <div className="absolute right-0 top-[120vh] grid w-full grid-cols-12 gap-x-6 md:left-1/2 md:right-auto md:top-[57vh] md:w-[67%] md:-translate-x-1/2 lg:left-0 lg:right-0 lg:top-[111vh] lg:w-[100%] lg:translate-x-0">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <div className="">
              <div className="relative px-4 md:hidden">
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
              <div className="hidden md:block lg:hidden">
                <LinePlusBlock
                  lineColor="#D8D8D8"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="center"
                  plusPosition="clamp(49%, calc(49% + (100vw - 900px) * 0.04), 52%)"
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
              <div className="hidden lg:block xl:hidden">
                <LinePlusBlock
                  lineColor="#4A4A4A"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="left"
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
                  lineColor="#D8D8D8"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="center"
                  plusPosition="clamp(49.4%, calc(41.4% + (100vw - 1280px) * 0.004), 41.8%)"
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

              {/* 2XL and above */}
              <div className="hidden 2xl:block">
                <LinePlusBlock
                  lineColor="#D8D8D8"
                  lineOpacity={0.2}
                  lineHeight={1}
                  lineWidth="100%"
                  lineOrigin="center"
                  plusPosition="clamp(49.5%, calc(49% + (100vw - 1536px) * 0.035), 59%)"
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

        {/* ===================================================
          QUOTE
          =================================================== */}

        <div className="absolute top-[135vh] grid grid-cols-12 gap-x-6 px-3 md:left-[4%] md:right-[4%] md:top-[64vh] md:px-0 lg:left-[1%] lg:right-0 lg:top-[124vh] lg:px-0 xl:top-[134vh] 2xl:top-[124vh]">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <div className="md:mb-25 mb-20 flex items-start justify-between gap-6">
              <h2
                ref={quoteRef}
                className="w-full max-w-[46rem] overflow-visible text-3xl font-medium leading-[0.9] tracking-[-0.05em] md:text-5xl md:leading-[1.2] lg:text-[65px] lg:leading-[1]"
                style={{
                  color: '#D8D8D81A',
                }}
              >
                {splitChars('True growth is not about adding more, but about becoming more.', 'quote')}
              </h2>

              <h2 className="shrink-0 text-4xl leading-none text-[#D8D8D8] md:text-[55px] lg:text-[65px]">&rdquo;</h2>
            </div>

            {/* BOTTOM TEXT */}

            <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:gap-14">
              <div className="max-w-84">
                <p ref={smallRef} className="leading-[1.1] text-[#D8D8D8] md:max-w-[15rem] md:text-[14px] lg:max-w-[16rem] lg:text-[13px]">
                  Recognized by global design platforms and trusted by brands across industries.
                </p>
              </div>

              <span ref={beliefRef} className="title max-w-56 border-l-2 border-[#F5F1E8] pl-4 text-[13px] uppercase leading-[1.1] md:translate-x-[40px] md:pl-4 lg:translate-x-0 lg:pl-4">
                {splitChars('This belief shapes how we approach every project.', 'belief')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
