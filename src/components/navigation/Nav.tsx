// Nav.tsx

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { scrollToId } from '@/utils/lenis';

import { NAV_CONFIG } from '@/data/navigation.data';

import { MenuPanel } from '@/components/navigation/MenuPanel';
import { ContactFormPanel } from '@/components/navigation/ContactFormPanel';
import { SplitTextHover } from '@/components/animations/SplitTextHover';

// ============================================================
// LOGO
// ============================================================

type AshenoxLogoNavProps = {
  className?: string;
};

export function AshenoxLogoNav({ className = 'text-white' }: AshenoxLogoNavProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3180 712" className={`h-5 w-auto ${className}`} fill="currentColor" aria-hidden="true">
      <defs>
        <clipPath id="a-logo">
          <rect width="798" height="712" />
        </clipPath>
      </defs>

      {/* ICON */}
      <g clipPath="url(#a-logo)">
        {/* Main A shape */}
        <path
          d="
            M446 4 L436 0 L352 0 L339 6 L331 15
            L3 656 L0 666 L1 684 L7 696 L18 706
            L32 711 L209 711 L320 709 L333 704 L343 697
            L424 617 L424 615 L210 615 L202 613 L193 608
            L182 596 L177 583 L178 566 L367 195 L375 186
            L381 183 L389 182 L396 184 L406 193 L503 377
            L510 387 L677 483 L681 483 L685 480 L686 474
            L458 17 L454 11 Z
          "
        />

        {/* Lower-right section */}
        <path
          d="
            M365 370 L376 370 L386 374 L736 584 L746 594
            L797 696 L797 700 L796 706 L789 711 L722 711
            L712 708 L361 513 L354 507 L349 500 L345 488
            L345 391 L349 381 L356 374 Z
          "
        />
      </g>

      {/* WORDMARK: "ASHENOX" */}
      <g transform="scale(1.2375)">
        {/* A */}
        <path
          fillRule="evenodd"
          d="
            M645 437 L743 157 L812 157 L910 437 L850 437 L834 387
            L722 387 L706 437 Z
            M740 335 L817 335 L778 220 Z
          "
        />

        {/* S */}
        <path
          d="
            M1145 214 L1098 241 C1086 215 1066 205 1043 205 C1019 205 1007 215 1007 232
            C1007 242 1013 250 1025 256 C1035 261 1052 267 1075 274
            C1100 281 1118 289 1130 298 C1145 310 1153 330 1153 358
            C1153 385 1142 408 1120 424 C1102 437 1080 443 1050 443
            C1020 443 995 435 975 420 C958 407 947 392 940 374 L988 346
            C998 372 1018 388 1052 388 C1085 388 1098 376 1098 360
            C1098 350 1093 342 1082 337 C1073 332 1058 327 1038 321
            C1010 313 990 304 975 292 C958 278 952 258 952 235
            C952 208 962 186 982 170 C1000 157 1021 151 1045 151
            C1075 151 1100 160 1120 177 C1132 187 1139 200 1145 214 Z
          "
        />

        {/* H */}
        <path d="M1211 157 H1266 V268 H1370 V157 H1425 V437 H1370 V321 H1266 V437 H1211 Z" />

        {/* E */}
        <path d="M1500 157 H1672 V209 H1556 V269 H1662 V321 H1556 V385 H1675 V437 H1500 Z" />

        {/* N */}
        <path d="M1737 157 H1779 L1899 327 V157 H1955 V437 H1913 L1793 266 V437 H1737 Z" />

        {/* O */}
        <path
          fillRule="evenodd"
          d="
            M2163 151 A146 146 0 1 1 2162.9 151 Z
            M2163 206 A91 91 0 1 0 2163.1 206 Z
          "
        />

        {/* X */}
        <path d="M2340 157 H2403 L2453 241 L2503 157 H2566 L2484 293 L2570 437 H2507 L2453 346 L2399 437 H2336 L2421 293 Z" />
      </g>
    </svg>
  );
}
// ============================================================
// MENU ICON
// ============================================================

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return <X className="h-3.5 w-3.5" />;
  }

  return (
    <span className="flex flex-col gap-0.5">
      <span className="block h-px w-3 bg-current" />
      <span className="block h-px w-3 bg-current" />
    </span>
  );
}

// ============================================================
// NAVIGATION
// ============================================================

export function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // ============================================================
  // SCROLL STATE
  // ============================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > NAV_CONFIG.scrollThreshold);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // ============================================================
  // CLOSE MENU
  // ============================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeContact = () => {
    setContactOpen(false);
  };

  // ============================================================
  // LOGO / HOME
  // ============================================================

  const handleLogoClick = () => {
    closeMenu();
    closeContact();

    if (location.pathname === '/') {
      scrollToId(NAV_CONFIG.logo.homeSectionId);
      return;
    }

    navigate('/');
  };

  // ============================================================
  // CONTACT — now opens the popup form instead of scrolling
  // ============================================================

  const handleContactClick = () => {
    closeMenu();
    setContactOpen(true);
  };

  // ============================================================
  // MENU
  // ============================================================

  const handleMenuToggle = () => {
    closeContact();
    setMenuOpen((prev) => !prev);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/*
        The navigation uses `mix-blend-mode: difference`.

        White elements automatically become dark over light
        backgrounds and remain light over dark backgrounds,
        allowing the navigation to adapt without JavaScript
        theme detection.
      */}
      <motion.header
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed left-0 top-0 z-[100] w-full px-3 pt-5 sm:px-6 sm:pt-6 md:px-6"
        style={{
          mixBlendMode: 'difference',
        }}
      >
        <div className={`flex w-full items-center justify-between transition-all duration-500 ${scrolled ? 'py-1' : ''}`}>
          {/* ==================================================
              LOGO
          ================================================== */}

          <button type="button" onClick={handleLogoClick} data-cursor={NAV_CONFIG.logo.cursor} aria-label={NAV_CONFIG.logo.ariaLabel} className="group flex items-center gap-2">
            <AshenoxLogoNav className="text-white" />
          </button>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="flex items-center gap-3">
            {/* ==================================================
                CONTACT
            ================================================== */}

            <button
              type="button"
              onClick={handleContactClick}
              data-cursor={NAV_CONFIG.contact.cursor}
              className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-wider text-black transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            >
              <SplitTextHover text={NAV_CONFIG.contact.label} />
            </button>

            {/* ==================================================
                MENU
            ================================================== */}

            <button
              type="button"
              onClick={handleMenuToggle}
              data-cursor={menuOpen ? NAV_CONFIG.menu.openCursor : NAV_CONFIG.menu.closedCursor}
              aria-label={menuOpen ? NAV_CONFIG.menu.openAriaLabel : NAV_CONFIG.menu.closedAriaLabel}
              className="flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-wider text-white transition-all duration-500 hover:border-white/50 hover:bg-white/5"
            >
              <span>
                <SplitTextHover text={NAV_CONFIG.menu.label} />
              </span>

              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ========================================================
          MENU PANEL
          Kept outside the blend-mode header so its own
          background is not affected by `mix-blend-mode`.
      ======================================================== */}

      <MenuPanel open={menuOpen} onClose={closeMenu} />

      {/* ========================================================
          CONTACT FORM POPUP
      ======================================================== */}

      <ContactFormPanel open={contactOpen} onClose={closeContact} />
    </>
  );
}

export default Nav;
