'use client';

import { ContactHero } from '@/pages/Contact/sections/ContactHero';
import { ContactForm } from '@/pages/Contact/sections/ContactForm';
import { LocationJoin } from '@/pages/Contact/sections/LocationJoin';
import { FAQ } from '@/pages/Contact/sections/FAQ';

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
