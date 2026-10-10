import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#F5F5F3] px-5 text-[#050505] sm:px-8 lg:px-12">
      {/* HEADER */}
      <header className="flex items-center justify-between py-6 sm:py-8">
        <Link to="/" aria-label="ASHENOX home" className="inline-flex flex-nowrap items-start gap-1 whitespace-nowrap">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3180 712" className={`h-5 w-auto`} fill="currentColor" aria-hidden="true">
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
          <span className="-mt-0.5 shrink-0 text-[16px] leading-none text-black/40">®</span>
        </Link>

        <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 sm:text-xs">Error / 404</span>
      </header>

      {/* MAIN CONTENT */}
      <section className="relative flex flex-1 flex-col justify-center pb-8 pt-8 xl:pb-10 xl:pt-1">
        {/* Small editorial label */}
        <div className="mb-3 flex items-center gap-3 sm:mb-0">
          <span className="h-px w-8 bg-black/50" />
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/60 sm:text-xs">Lost in the digital space</p>
        </div>

        {/* Oversized 404 */}
        <div className="relative">
          <h1
            aria-label="404"
            className="select-none text-[clamp(12rem,32vw,32rem)] font-medium leading-[0.76] tracking-[-0.105em] md:text-[clamp(22rem,32vw,52rem)] xl:text-center 2xl:text-[clamp(12rem,32vw,20rem)]"
          >
            404
          </h1>

          {/* Decorative marker */}
          <span aria-hidden="true" className="absolute right-[5%] top-[5%] h-3 w-3 rounded-full bg-[#050505] sm:right-[12%] sm:top-[12%] sm:h-5 sm:w-5" />
        </div>

        {/* Bottom content */}
        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-black/15 pt-6 sm:mt-14 sm:grid-cols-2 sm:items-end lg:mt-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/45 sm:text-xs">Wrong turn.</p>

            <h2 className="mt-3 max-w-lg text-3xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-4xl lg:text-5xl">
              This page
              <br />
              doesn&apos;t exist.
            </h2>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <p className="max-w-xs text-sm leading-relaxed text-black/55 sm:text-right">The page may have moved, or the link may be incorrect. Let&apos;s get you back on track.</p>

            <Link
              to="/"
              className="group mt-6 inline-flex min-h-12 items-center justify-between gap-8 border border-black/20 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 hover:bg-[#050505] hover:text-[#F5F5F3]"
            >
              Back to home
              <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER-LIKE LABEL, NOT THE SITE FOOTER */}
      <div className="flex items-center justify-between border-t border-black/10 py-4 text-[9px] uppercase tracking-[0.16em] text-black/40 sm:py-5 sm:text-[10px]">
        <span>ASHENOX®</span>
        <span>End of the road. Start again.</span>
      </div>
    </main>
  );
}
