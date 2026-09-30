export const siteConfig = {
  analytics: {
    alwaysLoad: import.meta.env.ANALYTICS_ALWAYS_LOAD === 'true',
    vendors: {
      googleAnalytics: {
        enabled: import.meta.env.GA_ENABLED === 'true',
        id: import.meta.env.GA_ID || '',
      },
      rybbit: {
        enabled: import.meta.env.RYBBIT_ENABLED === 'true',
        id: import.meta.env.RYBBIT_ID || '',
        src: import.meta.env.RYBBIT_SRC || 'https://rybbit.example.com/api/script.js',
      },
      umami: {
        enabled: import.meta.env.UMAMI_ENABLED === 'true',
        id: import.meta.env.UMAMI_ID || '',
        src: import.meta.env.UMAMI_SRC || 'https://analytics.umami.is/script.js',
      },
    },
  },
  announcement: {
    enabled: true,
    id: 'upgrade_v2_0_0', // Change this ID to reshow the banner
    link: '/blog',
  },
  blog: {
    postsPerPage: 6,
  },
  contact: {
    address: {
      city: 'Endurance',
      full: 'Interstellar Space Station',
    },
    email: {
      sales: 'sales@interstellar.com',
      support: 'support@interstellar.com',
    },
    phone: {
      label: 'Mon-Fri 9am-6pm PST',
      main: '+1 (555) 123-4567',
    },
  },
  description: 'Premium Astro Boilerplate for explorers.',
  logo: {
    alt: 'Cooper Logo',
    src: '/logo.svg',
    srcDark: '/logo.svg', // Used when strategy is 'switch'
    strategy: 'invert' as 'invert' | 'switch' | 'static', // 'invert' | 'switch' | 'static'
  },
  name: 'Cooper',
  ogImage: '/og-image.webp',
  primaryColor: '#00008B', // Default primary color,
};

export const NAV_LINKS = [
  {
    children: [
      { description: 'What makes us different', href: '/features', icon: 'Zap', label: 'Features' },
      { description: 'Plans for every team', href: '/pricing', icon: 'CreditCard', label: 'Pricing' },
    ],
    href: '/features',
    label: 'Product',
  },
  {
    href: '/blog',
    label: 'Blog',
  },
  {
    children: [
      { description: 'Our story & mission', href: '/about', icon: 'Building2', label: 'About' },
      { description: 'Get in touch with us', href: '/contact', icon: 'Mail', label: 'Contact' },
    ],
    href: '/about',
    label: 'Company',
  },
];

export const ACTION_LINKS = {
  primary: { href: '/pricing', label: 'Get Started' },
  social: {
    facebook: 'https://facebook.com/gladtek',
    github: 'https://github.com/gladtek',
    linkedin: 'https://linkedin.com/company/gladtek',
    twitter: 'https://twitter.com/gladtek',
    youtube: 'https://youtube.com/@gladtek',
  },
};

export const FOOTER_LINKS = {
  legal: {
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
    title: 'Legal',
  },
  product: {
    links: [
      { href: '/features', label: 'Features' },
      { href: '/about', label: 'About' },
      { href: '/pricing', label: 'Pricing' },
    ],
    title: 'Product',
  },
};
