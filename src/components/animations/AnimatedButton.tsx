'use client';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

// ============================================================
// TYPES
// ============================================================

type AnimatedButtonProps = {
  children: string;
  onClick?: () => void;
  href?: string;

  className?: string;
  widthClassName?: string;

  dataCursor?: string;
  ariaLabel?: string;

  target?: string;
  rel?: string;

  variant?: 'animated' | 'simple';

  icon?: 'up-right' | 'right' | 'none';
  iconSize?: number;

  // Animation
  charShift?: number;
  charStagger?: number;
  charDuration?: number;

  // Colors
  colorMode?: 'custom' | 'blend';

  textColor?: string;
  hoverTextColor?: string;

  borderColor?: string;
  hoverBorderColor?: string;

  iconColor?: string;
  hoverIconColor?: string;
};

// ============================================================
// DEFAULTS
// ============================================================

const DEFAULT_CHAR_STAGGER = 0.035;
const DEFAULT_CHAR_DURATION = 0.95;

const LETTER_SPACING_REST = '0px';
const LETTER_SPACING_HOVER = '0.2px';

const BORDER_REDUCE_DURATION = 0.5;
const BORDER_EASE = [0.65, 0, 0.35, 1] as const;

const SPACING_TRANSITION = {
  duration: 0.55,
  ease: [0.16, 1, 0.3, 1] as const,
};

const ARROW_TRANSITION = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1] as const,
};

// ============================================================
// ICON
// ============================================================

function ButtonIcon({ type, size, color }: { type: 'up-right' | 'right' | 'none'; size: number; color: string }) {
  if (type === 'none') return null;

  const Icon = type === 'up-right' ? ArrowUpRight : ArrowRight;

  return (
    <Icon
      size={size}
      strokeWidth={1.2}
      color={color}
      className={type === 'right' ? 'transition-transform duration-300 group-hover:translate-x-1' : 'transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1'}
    />
  );
}

// ============================================================
// ANIMATED CONTENT
// ============================================================

function AnimatedContent({
  children,
  hovered,
  charShift,
  charStagger,
  charDuration,
  borderColor,
  hoverBorderColor,
  iconColor,
  hoverIconColor,
}: {
  children: string;
  hovered: boolean;
  charShift: number;
  charStagger: number;
  charDuration: number;

  borderColor: string;
  hoverBorderColor: string;

  iconColor: string;
  hoverIconColor: string;
}) {
  const chars = Array.from(children);

  const characterCount = chars.length;

  const animationTotal = (characterCount - 1) * charStagger + charDuration;

  const borderGrowDelay = BORDER_REDUCE_DURATION;

  const borderGrowDuration = Math.max(animationTotal - borderGrowDelay, 0.1);

  const charTransition = {
    duration: charDuration,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <>
      {/* ======================================================
          BOTTOM BORDER
      ====================================================== */}

      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px">
        {/* Resting border */}

        <motion.span
          className="absolute inset-0 origin-right"
          initial={false}
          style={{
            backgroundColor: borderColor,
          }}
          animate={{
            scaleX: hovered ? 0 : 1,
            backgroundColor: borderColor,
          }}
          transition={{
            duration: BORDER_REDUCE_DURATION,
            ease: BORDER_EASE,
            delay: hovered ? 0 : BORDER_REDUCE_DURATION,
          }}
        />

        {/* Hover border */}

        <motion.span
          className="absolute inset-0 origin-left"
          initial={false}
          style={{
            backgroundColor: hoverBorderColor,
          }}
          animate={{
            scaleX: hovered ? 1 : 0,
            backgroundColor: hoverBorderColor,
          }}
          transition={{
            duration: hovered ? borderGrowDuration : BORDER_REDUCE_DURATION,
            ease: BORDER_EASE,
            delay: hovered ? borderGrowDelay : 0,
          }}
        />
      </span>

      {/* ======================================================
          LEFT ARROW
      ====================================================== */}

      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-[-2px] flex -translate-y-1/2 items-center"
        initial={false}
        style={{
          color: hovered ? hoverIconColor : iconColor,
        }}
        animate={
          hovered
            ? {
                opacity: 1,
                x: 0,
                color: hoverIconColor,
              }
            : {
                opacity: 0,
                x: -10,
                color: iconColor,
              }
        }
        transition={{
          ...ARROW_TRANSITION,
          delay: hovered ? chars.length * charStagger * 0.9 : 0,
        }}
      >
        <ArrowRight size={11} strokeWidth={2} />
      </motion.span>

      {/* ======================================================
          TEXT
      ====================================================== */}

      <motion.span
        className="relative inline-flex items-center whitespace-pre"
        initial={false}
        animate={{
          letterSpacing: hovered ? LETTER_SPACING_HOVER : LETTER_SPACING_REST,
        }}
        transition={SPACING_TRANSITION}
      >
        {chars.map((char, index) => {
          const reverseIndex = chars.length - 1 - index;

          return (
            <motion.span
              key={`${char}-${index}`}
              className="inline-block whitespace-pre will-change-transform"
              initial={{
                x: 0,
              }}
              animate={{
                x: hovered ? charShift : 0,
              }}
              transition={{
                ...charTransition,
                delay: hovered ? reverseIndex * charStagger : index * 0.025,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          );
        })}
      </motion.span>

      {/* ======================================================
          RIGHT ARROW
      ====================================================== */}

      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-[-2px] flex -translate-y-1/2 items-center"
        initial={false}
        style={{
          color: iconColor,
        }}
        animate={
          hovered
            ? {
                opacity: 0,
                x: 10,
                color: hoverIconColor,
              }
            : {
                opacity: 1,
                x: 0,
                color: iconColor,
              }
        }
        transition={{
          ...ARROW_TRANSITION,
          delay: hovered ? chars.length * charStagger * 0.4 : 0.4,
        }}
      >
        <ArrowRight size={11} strokeWidth={2} />
      </motion.span>
    </>
  );
}

// ============================================================
// SIMPLE CONTENT
// ============================================================

function SimpleContent({ children, icon, iconSize, iconColor }: { children: string; icon: 'up-right' | 'right' | 'none'; iconSize: number; iconColor: string }) {
  return (
    <>
      <span>{children}</span>

      <ButtonIcon type={icon} size={iconSize} color={iconColor} />
    </>
  );
}

// ============================================================
// COMPONENT
// ============================================================

export function AnimatedButton({
  children,
  onClick,
  href,

  className = '',
  widthClassName = '',

  dataCursor,
  ariaLabel,

  target,
  rel,

  variant = 'simple',

  icon = 'up-right',
  iconSize = 13,

  // Animation
  charShift = 60,
  charStagger = DEFAULT_CHAR_STAGGER,
  charDuration = DEFAULT_CHAR_DURATION,

  // Colors
  colorMode = 'custom',

  textColor = 'rgba(255, 255, 255, 0.8)',
  hoverTextColor = '#ffffff',

  borderColor = 'rgba(255, 255, 255, 0.3)',
  hoverBorderColor = '#ffffff',

  iconColor = 'currentColor',
  hoverIconColor = 'currentColor',
}: AnimatedButtonProps) {
  const [hovered, setHovered] = useState(false);

  // ==========================================================
  // COLOR MODE
  // ==========================================================

  const isBlend = colorMode === 'blend';

  /*
   * Blend mode uses white as the source color.
   *
   * mix-blend-mode: difference
   * then automatically inverts it against whatever
   * is behind the button.
   */
  const resolvedTextColor = isBlend ? '#ffffff' : hovered ? hoverTextColor : textColor;

  const resolvedBorderColor = isBlend ? '#ffffff' : borderColor;

  const resolvedHoverBorderColor = isBlend ? '#ffffff' : hoverBorderColor;

  const resolvedIconColor = isBlend ? '#ffffff' : iconColor;

  const resolvedHoverIconColor = isBlend ? '#ffffff' : hoverIconColor;

  // ==========================================================
  // SHARED CLASS
  // ==========================================================

  const sharedClassName = `
    group
    relative
    flex
    min-h-7
    cursor-pointer
    items-center
    overflow-hidden
    text-[10px]
    uppercase
    tracking-[-0.01em]
    no-underline
    ${widthClassName}
    ${className}
  `;

  // ==========================================================
  // CONTENT
  // ==========================================================

  const content =
    variant === 'animated' ? (
      <AnimatedContent
        children={children}
        hovered={hovered}
        charShift={charShift}
        charStagger={charStagger}
        charDuration={charDuration}
        borderColor={resolvedBorderColor}
        hoverBorderColor={resolvedHoverBorderColor}
        iconColor={resolvedIconColor}
        hoverIconColor={resolvedHoverIconColor}
      />
    ) : (
      <SimpleContent children={children} icon={icon} iconSize={iconSize} iconColor={hovered ? resolvedHoverIconColor : resolvedIconColor} />
    );

  // ==========================================================
  // HOVER
  // ==========================================================

  const handleEnter = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  // ==========================================================
  // COMMON PROPS
  // ==========================================================

  const commonProps = {
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,

    'data-cursor': dataCursor,
    'aria-label': ariaLabel ?? children,

    className: `
      ${sharedClassName}
      ${isBlend ? 'mix-blend-difference text-white' : ''}
    `,

    style: {
      color: resolvedTextColor,
    },
  };

  // ==========================================================
  // LINK
  // ==========================================================

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...commonProps}>
        {content}
      </a>
    );
  }

  // ==========================================================
  // BUTTON
  // ==========================================================

  return (
    <button type="button" onClick={onClick} {...commonProps}>
      {content}
    </button>
  );
}

export default AnimatedButton;
