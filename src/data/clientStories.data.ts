export type Testimonial = {
  company: string;
  title: string;
  review: string;
  name: string;
  role: string;
  image: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    company: 'LUXURY PRESENCE',
    title: 'Sunny and his award winning team are second to none when it comes to responsive web design.',
    review:
      'Their ability to take an idea and transform it into an exceptional digital experience has always impressed us. Every interaction felt collaborative, every detail intentional, and every launch exceeded expectations.',
    name: 'Doug Petrie',
    role: 'Founder & CEO · USA',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },
  {
    company: 'CREDIBLE',
    title: 'Working with the team felt like extending our own product organization.',
    review:
      'Their ability to take an idea and transform it into an exceptional digital experience has always impressed us. Every interaction felt collaborative, every detail intentional, and every launch exceeded expectations.',
    name: 'Sarah Williams',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  {
    company: 'FAST RESUME',
    title: 'The redesign dramatically improved our brand perception.',
    review:
      'Their ability to take an idea and transform it into an exceptional digital experience has always impressed us. Every interaction felt collaborative, every detail intentional, and every launch exceeded expectations.',
    name: 'Michael Ross',
    role: 'Founder',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
  },
  {
    company: 'TECHNIS',
    title: 'Creative, reliable and incredibly detail-oriented.',
    review:
      'Their ability to take an idea and transform it into an exceptional digital experience has always impressed us. Every interaction felt collaborative, every detail intentional, and every launch exceeded expectations.',
    name: 'Emma Johnson',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
  {
    company: 'VENTIGENCE',
    title: 'A world-class digital partner that truly understands storytelling.',
    review:
      'Their ability to take an idea and transform it into an exceptional digital experience has always impressed us. Every interaction felt collaborative, every detail intentional, and every launch exceeded expectations.',
    name: 'David Chen',
    role: 'CEO',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
  },
];

export const CLIENT_STORIES_CONTENT = {
  heading: 'Client stories',
  description: 'Great work starts with great collaboration. Here’s what our clients say about working with Ashenox.',
  cta: 'Become a Client',
};
