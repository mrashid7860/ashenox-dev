export interface NavItem {
  label: string;
  path: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

// ============================================================
// NAVIGATION
// ============================================================

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Work',
    path: '/portfolio',
  },
  {
    label: 'Services',
    path: '/services',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

// ============================================================
// CONTACT
// ============================================================

export const NAV_CONTACT = {
  email: 'info@ashenox.com',
  phone: '+919824182099',
} as const;

// ============================================================
// SOCIAL LINKS
// ============================================================

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Linkedin',
    url: 'https://www.linkedin.com/',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/',
  },
  {
    name: 'Dribbble',
    url: 'https://dribbble.com/',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/',
  },
];

// ============================================================
// NAVIGATION CONFIG
// ============================================================

export const NAV_CONFIG = {
  scrollThreshold: 40,

  logo: {
    cursor: 'Home',
    ariaLabel: 'Go to home',
    homeSectionId: 'hero',
  },

  contact: {
    label: "LET'S TALK",
    cursor: 'Say hi',
    sectionId: 'contact',
  },

  menu: {
    label: 'MENU',
    openCursor: 'Close',
    closedCursor: 'Menu',
    openAriaLabel: 'Close menu',
    closedAriaLabel: 'Open menu',
  },
} as const;
