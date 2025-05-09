import { t } from 'i18next';
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
    name: t('Ecosystem'),
    href: 'https://ecosystem.avax.network/',
  },
  {
    name: t('Bridge'),
    href: 'https://bridge.avax.network/',
  },
  {
    name: t('Explorer'),
    href: 'https://explorer.avax.network/',
  },
  {
    name: t('Community'),
    items: [
      {
        name: t('Developer Docs'),
        href: 'https://docs.avax.network/',
      },
      {
        name: t('Forum'),
        href: 'https://forum.avax.network/',
      },
      {
        name: t('About Avalanche'),
        href: 'https://www.avax.network/',
      },
      {
        name: t('About Ava Labs'),
        href: 'https://www.avalabs.org/',
      },
    ],
  },
];
