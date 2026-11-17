export interface NavItem {
  id: string;
  label: string;
  href: string;
  description: string;
  access?: 'signed-in';
}

export interface DiscoveryGroup {
  id: string;
  label: string;
  intro: string;
  featured: {
    href: string;
    label: string;
    description: string;
  };
  items: NavItem[];
}

export const DISCOVERY_NAV: DiscoveryGroup[] = [
  {
    id: 'discover',
    label: 'Discover',
    intro: 'Find useful conversations, people, and ideas from across HR Shakti.',
    featured: {
      href: '/search',
      label: 'Search HR Shakti',
      description: 'Look across public people, conversations, opportunities, and learning.',
    },
    items: [
      {
        id: 'search',
        label: 'Search',
        href: '/search',
        description: 'Find people, opportunities, and shared practice.',
      },
      {
        id: 'feed',
        label: 'Community feed',
        href: '/feed',
        description: 'Catch up on public conversations and updates.',
      },
      {
        id: 'people',
        label: 'People directory',
        href: '/people',
        description: 'Browse member profiles and professional interests.',
      },
    ],
  },
  {
    id: 'career',
    label: 'Career',
    intro: 'Explore practical next steps for your work and professional growth.',
    featured: {
      href: '/jobs',
      label: 'Explore open roles',
      description: 'Browse current opportunities and their published details.',
    },
    items: [
      {
        id: 'jobs',
        label: 'Open roles',
        href: '/jobs',
        description: 'Explore published job opportunities.',
      },
      {
        id: 'career-paths',
        label: 'Career paths',
        href: '/career',
        description: 'Explore role paths and development steps.',
      },
      {
        id: 'organizations',
        label: 'Organizations',
        href: '/organizations',
        description: 'Discover organizations on HR Shakti.',
      },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    intro: 'Build your practice with courses, learning paths, and field knowledge.',
    featured: {
      href: '/learning',
      label: 'Visit the learning library',
      description: 'Browse the courses and resources currently available.',
    },
    items: [
      {
        id: 'learning',
        label: 'Learning library',
        href: '/learning',
        description: 'Browse published learning resources.',
      },
      {
        id: 'learning-paths',
        label: 'Learning paths',
        href: '/learning-paths',
        description: 'Follow structured paths through a subject.',
      },
      {
        id: 'knowledge-hub',
        label: 'Knowledge hub',
        href: '/knowledge-hub',
        description: 'Read practical knowledge resources.',
      },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    intro: 'Meet peers, share questions, and take part in the community.',
    featured: {
      href: '/communities',
      label: 'Find a community',
      description: 'Explore public groups and their shared interests.',
    },
    items: [
      {
        id: 'communities',
        label: 'Communities',
        href: '/communities',
        description: 'Find groups around the work you do.',
      },
      {
        id: 'discussions',
        label: 'Discussions',
        href: '/discussions',
        description: 'Read and join public conversations.',
      },
      {
        id: 'questions',
        label: 'Questions & answers',
        href: '/questions',
        description: 'Explore questions shared by the community.',
      },
      {
        id: 'events',
        label: 'Events',
        href: '/events',
        description: 'See published events and activities.',
      },
      {
        id: 'mentorship',
        label: 'Mentorship',
        href: '/mentorship',
        description: 'Explore the mentorship program.',
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    intro: 'Keep up with HR and work news, useful articles, and HR Shakti.',
    featured: {
      href: '/news',
      label: 'Read the latest news',
      description: 'Browse the current HR and people news feed.',
    },
    items: [
      {
        id: 'news',
        label: 'News',
        href: '/news',
        description: 'Read published HR and work news.',
      },
      {
        id: 'journal',
        label: 'Journal',
        href: '/blogs',
        description: 'Read articles from the HR Shakti journal.',
      },
      {
        id: 'about',
        label: 'About HR Shakti',
        href: '/about',
        description: 'Learn about the platform and its community.',
      },
      {
        id: 'contact',
        label: 'Contact',
        href: '/contact',
        description: 'Get in touch with the HR Shakti team.',
      },
    ],
  },
];

export const WORKSPACE_RAIL_LINKS = [
  { href: '/calendar', label: 'My calendar' },
  { href: '/tasks', label: 'My tasks' },
  { href: '/support', label: 'Help desk' },
  { href: '/surveys', label: 'Surveys' },
  { href: '/certificates', label: 'Credentials' },
  { href: '/network', label: 'My network' },
];
