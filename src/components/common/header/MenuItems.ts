export interface MenuItem {
  name: string;
  href?: string;
  to?: string;
  highlighted?: boolean;
  icon?: string;
  items?: MenuItem[];
}

export const menuItems = [
  {
    name: 'Ecosystem',
    href: 'https://ecosystem.avax.network/',
  },
  {
    name: 'Bridge',
    href: 'https://bridge.avax.network/',
  },
  {
    name: 'Explorer',
    href: 'https://explorer.avax.network/',
  },
  {
    name: 'Community',
    items: [
      {
        name: 'Developer Docs',
        href: 'https://docs.avax.network/',
      },
      {
        name: 'Forum',
        href: 'https://forum.avax.network/',
      },
      {
        name: 'About Avalanche',
        href: 'https://www.avax.network/',
      },
      {
        name: 'About Ava Labs',
        href: 'https://www.avalabs.org/',
      },
    ],
  },
];
