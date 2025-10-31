import { isDevelopment, isProductionBuild } from './utils/environment';
import browser from 'webextension-polyfill';

const CORE_WEB_DOMAIN = 'core.app' as const;
/**
 * Supports Core Web preview URLs.
 *
 * @example 'https://abc123-core-web-dev.avalabs.workers.dev'
 */
const CORE_WEB_PREVIEW_DOMAIN = 'avalabs.workers.dev' as const;

const CORE_WEB_STAGING_DOMAINS = [
  'staging.core.app',
  'develop.core.app',
] as const;
const DAPP_DEV_DOMAINS = [
  CORE_WEB_PREVIEW_DOMAIN,
  'localhost',
  '127.0.0.1',
] as const;

const SYNCED_DOMAINS_PRODUCTION_BUILD = [
  CORE_WEB_DOMAIN,
  CORE_WEB_PREVIEW_DOMAIN,
] as const;
const SYNCED_DOMAINS_DEVELOPMENT_BUILD = [
  CORE_WEB_DOMAIN,
  ...CORE_WEB_STAGING_DOMAINS,
  ...DAPP_DEV_DOMAINS,
] as const;

const KNOWN_AVACLOUD_DOMAINS = [
  'avacloud.io',
  'avacloud-app.pages.dev',
  'launchpad.avacloud.io',
];

const PLAYGROUD_APP = 'ava-labs.github.io';

export const KNOWN_CORE_DOMAINS = [
  CORE_WEB_DOMAIN,
  ...CORE_WEB_STAGING_DOMAINS,
  ...DAPP_DEV_DOMAINS,
] as const;

// Domains allowed to access the avalanche_* methods
export const WHITELISTED_DOMAINS = [
  ...KNOWN_CORE_DOMAINS,
  ...KNOWN_AVACLOUD_DOMAINS,
  ...DAPP_DEV_DOMAINS,
  PLAYGROUD_APP,
];

export const SYNCED_DOMAINS = isProductionBuild()
  ? SYNCED_DOMAINS_PRODUCTION_BUILD
  : SYNCED_DOMAINS_DEVELOPMENT_BUILD;

export const WALLET_CONNECT_APP_METADATA = {
  name: browser.i18n.getMessage('appName'),
  // When connecting to Core Mobile, it will allow us to send avalanche_*
  // requests, as long as it recognizes us as part of the Core product.
  //
  // In local development, the extension ID may change from one machine
  // to another, so we use localhost to make it work.
  //
  // For production & blue builds, Core Mobile is able to recognize their
  // extension IDs, since they are permanent.
  url: isDevelopment() ? 'https://localhost' : location.origin,
  description: browser.i18n.getMessage('appDesc'),
  icons: ['https://extension.core.app/apple-touch-icon.png'],
};
