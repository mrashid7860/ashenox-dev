import partner1 from '@/assets/img/Partner/partner1.png';
import partner2 from '@/assets/img/Partner/partner2.png';
import partner3 from '@/assets/img/Partner/partner3.webp';
import partner4 from '@/assets/img/Partner/partner4.png';
import partner5 from '@/assets/img/Partner/partner5.png';

import awardsCardVideo from '@/assets/video/awards-card-video_m.mp4';
import rushi from '@/assets/video/rushi_m.mp4';

// ============================================================
// PARTNERS
// ============================================================

export const PARTNERS = [partner1, partner2, partner3, partner4, partner5];

// ============================================================
// KEY FACTS
// ============================================================

export const KEY_FACTS = [
  {
    id: '01',
    type: 'awards',
  },
  {
    id: '02',
    type: 'projects',
  },
  {
    id: '03',
    type: 'team',
  },
] as const;

// ============================================================
// MEDIA
// ============================================================

export const MEDIA = {
  awards: awardsCardVideo,
  team: rushi,
};

// ============================================================
// CONTENT
// ============================================================

export const KEY_FACT_CONTENT = {
  awards: {
    label: 'Years of creative experience',
    description: 'Building brands, digital experiences, creative content with purpose.',
    number: '3',
    suffix: '+',
    logo: '/images/thefwa.svg',
  },

  projects: {
    label: 'Brands & projects',
    description: ['From branding and social content to websites and digital experiences.'],
    number: '10',
    suffix: '+',
  },

  team: {
    label: 'Commitment to craft',
    description: ['Every project gets the same attention to detail, clarity, and creative thinking.'],
    number: '100',
    suffix: '%',
  },

  intro: {
    title: 'OUR  JOURNEY',
    description: ['A snapshot of what we’ve built, what we’ve learned, and where we’re going.'],
  },

  partners: {
    title: 'Our business partners',
  },
} as const;
