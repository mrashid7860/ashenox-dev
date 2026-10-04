'use client';

import { ContactHero } from '@/pages/Contact/sections/ContactHero';
import { ContactForm } from '@/pages/Contact/sections/ContactForm';
import { LocationJoin } from '@/pages/Contact/sections/LocationJoin';
import { FAQ } from '@/pages/Contact/sections/FAQ';

import { MoltenMetalBackground } from '@/components/common/MoltenMetalBackground';

export function Contact() {
  return (
    <main id="contact" className="overflow-x-clip">
      {/* =====================================================
          CONTACT HERO + FIXED BACKGROUND
      ===================================================== */}
      <section className="relative">
        {/* Fixed/sticky molten background */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="sticky top-0 h-screen w-full">
            <MoltenMetalBackground />
          </div>
        </div>

        {/* Contact Hero scrolls over the background */}
        <div className="relative z-10">
          <ContactHero />
        </div>
      </section>

      {/* =====================================================
          REST OF CONTACT PAGE
      ===================================================== */}
      <section className="relative z-20 bg-white">
        <ContactForm />
        <LocationJoin />
        <FAQ />
      </section>
    </main>
  );
}

export default Contact;
