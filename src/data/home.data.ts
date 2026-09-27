export const homeData = {
  hero: {
    heading: {
      prefix: ['Designed to', 'mean'],

      rotatingWords: ['Something.', 'intention.', 'purpose.', 'depth.', 'Transform.'],
    },

    cta: {
      label: 'Discuss your project',
      cursorLabel: 'Say hi',
      target: 'contact',
    },

    scroll: {
      target: 'about',
      ariaLabel: 'Scroll to about',
    },

    experience: {
      established: 'EST. 2025',
      years: '5+ Years Shaping Digital Direction',
      description: 'Websites, AI products, brands, and systems built for clarity, scale and impact.',
    },
  },
  about: {
    label: 'About',

    paragraph: 'Trionn is an independent digital studio crafting meaningful brand experiences through strategy, design, and technology.',
  },
  aboutMisson: {
    design: ['WE DESIGN FOR LONGEVITY.', 'CLARITY FIRST, CRAFT ALWAYS.', 'BUILT TO SCALE.'],
    mission: 'Our mission is to make technology feel human by designing digital products that are intuitive, purposeful, and meaningful to people.',
    vision: ['FOCUSED VISION.', 'MEASURED EXECUTION.'],
    marquee: ['INNOVATE', 'IMPACT', 'INSPIRE'],
    marqueeCaption: 'FROM IDEA TO OUTCOME.',
  },
  journey: {
    image: 'https://images.pexels.com/photos/459354/pexels-photo-459354.jpeg',

    heading: 'Key facts',

    description: ['A snapshot of our experience', 'and impact.'],

    partnersLabel: 'Our Business Partners',

    partners: ['credible', 'Yellowtail', 'Luxury Presence', 'technis', 'OCKTO'],

    panels: [
      {
        icon: '↗',
        title: 'Going\nZero to One',
        description: "If you're navigating a new business unit, or a new venture entirely, or breaking into a new market",
        background: '#e9e9e6',
        textColor: '#1a1a1a',
      },
      {
        icon: '○○',
        title: 'Scaling from\nOne to N',
        description: "If you've achieved Product/Service Market Fit, and are looking to scale your business to new heights",
        background: 'linear-gradient(160deg,#e23b2e 0%,#8f1712 100%)',
        textColor: '#ffffff',
      },
      {
        icon: '✳',
        title: 'Need Quick\nSolutions',
        description: 'If you know exactly what you want and need a team that can step in and quickly help you with it',
        background: 'linear-gradient(160deg,#1c1c1c 0%,#050505 100%)',
        textColor: '#ffffff',
      },
    ],
  },
} as const;
