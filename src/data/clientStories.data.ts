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
    company: 'FABRIOX',
    title: 'Ashenox turned our vision into a digital experience that feels as refined as our brand.',
    review:
      'The team understood our direction from the beginning and translated it into a polished, premium experience. From the visual identity to the smallest interactions, everything felt intentional and well executed.',
    name: 'Rohan Mehta',
    role: 'Founder & CEO · India',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },

  {
    company: 'PC SECURE',
    title: 'They made a complex cybersecurity product feel simple, clear, and trustworthy.',
    review:
      'Ashenox helped us communicate our product in a much more approachable way. The new digital experience gives our customers confidence while keeping the interface clean and easy to understand.',
    name: 'Amit Sharma',
    role: 'Founder & Director · India',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
  },

  {
    company: 'CURRIES OF COAST',
    title: 'They captured the personality of our brand and brought it beautifully into the digital space.',
    review:
      'Ashenox created an experience that feels vibrant, contemporary, and true to our identity. The attention to imagery, typography, and interaction made a real difference to how our brand is presented online.',
    name: 'Neha Nair',
    role: 'Founder · India',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },

  {
    company: 'KAO',
    title: 'Ashenox understood how to turn the energy of our events into a digital experience.',
    review:
      'The creative direction felt bold without becoming overwhelming. They captured the culture, music, and energy behind Kao and translated it into a digital presence that feels memorable and distinctive.',
    name: 'Aditya Verma',
    role: 'Creative Director · India',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },

  {
    company: 'FITANAZ',
    title: 'They gave our performance nutrition brand the premium presence we were looking for.',
    review:
      'From the visual direction to the digital experience, the team helped us build a stronger and more confident brand. Everything feels sharper, more premium, and much closer to where we want to take Fitanaz.',
    name: 'Karan Malhotra',
    role: 'Founder & CEO · India',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
  },
];

export const CLIENT_STORIES_CONTENT = {
  heading: 'Client stories',
  description: 'Great work starts with great collaboration. Here’s what our clients say about working with Ashenox.',
  cta: 'Become a Client',
};
