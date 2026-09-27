import partner1 from '@/assets/img/Partner/partner1.svg';
import partner2 from '@/assets/img/Partner/partner2.svg';
import partner3 from '@/assets/img/Partner/partner3.svg';
import partner4 from '@/assets/img/Partner/partner4.svg';
import partner5 from '@/assets/img/Partner/partner5.svg';

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
    label: 'Featured & Awards',
    description: 'Featured on top design platforms worldwide.',
    number: '50',
    suffix: '+',
    logo: '/images/thefwa.svg',
  },

  projects: {
    label: 'Projects completed',
    description: ['90% of our clients seek our', 'services for a second project.'],
    number: '1.5K',
    suffix: '+',
  },

  team: {
    label: 'Our team members',
    description: ['Different skills.', 'One standard.'],
    number: '20',
    suffix: '+',
  },

  intro: {
    title: 'Key facts',
    description: ['A snapshot of our experience and impact.'],
  },

  partners: {
    title: 'Our business partners',
  },
} as const;
