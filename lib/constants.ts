export interface EventInfo {
  id: number;
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  time: string;
  image: string;
  url: string;
}

export const events: EventInfo[] = [
  {
    id: 1,
    title: 'React Summit 2026',
    slug: 'react-summit-2026',
    date: '2026-04-14',
    time: '09:00 AM',
    location: 'Amsterdam, Netherlands',
    description:
      'The largest React conference with workshops, keynotes, and community talks.',
    image: '/images/event1.png',
    url: 'https://reactsummit.com',
  },
  {
    id: 2,
    title: 'Next.js Conf 2026',
    slug: 'nextjs-conf-2026',
    time: '10:00 AM',
    date: '2026-05-20',
    location: 'San Francisco, CA',
    description:
      'Official Next.js flagship event with deep dives and product announcements.',
    image: '/images/event2.png',
    url: 'https://nextjs.org/conf',
  },
  {
    id: 3,
    title: 'Jamstack Hackathon',
    slug: 'jamstack-hackathon-2026',
    time: '12:00 PM',
    date: '2026-06-08',
    location: 'Remote',
    description:
      '48-hour online hackathon for Jamstack builders with prizes and mentorship.',
    image: '/images/event3.png',
    url: 'https://jamstack.org/hackathon',
  },
  {
    id: 4,
    title: 'Google I/O 2026',
    slug: 'google-io-2026',
    time: '09:00 AM',
    date: '2026-05-14',
    location: 'Mountain View, CA',
    description:
      'Developer conference for Android, web, cloud, and AI technologies.',
    image: '/images/event4.png',
    url: 'https://events.google.com/io',
  },
  {
    id: 5,
    title: 'Node+JS Interactive',
    slug: 'node-js-interactive-2026',
    time: '11:00 AM',
    date: '2026-08-12',
    location: 'New York, NY',
    description:
      'Node.js and JavaScript ecosystem conference with workshops and networking.',
    image: '/images/event5.png',
    url: 'https://events.linuxfoundation.org/node-interactive',
  },
  {
    id: 6,
    title: 'Women Who Code Global Meetup',
    slug: 'women-who-code-global-meetup-2026',
    date: '2026-07-27',
    time: '06:00 PM',
    location: 'Online + London',
    description:
      'Community-driven meetup spotlighting inclusive growth and technical talks.',
    image: '/images/event6.png',
    url: 'https://www.womenwhocode.com',
  },
];
