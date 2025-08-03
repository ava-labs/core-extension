import { isDevelopment, isProductionBuild } from './utils/environment';
import browser from 'webextension-polyfill';

const CORE_WEB_DOMAIN = 'core.app' as const;
const CORE_WEB_STAGING_DOMAINS = [
  'staging.core.app',
  'core-web.pages.dev', // Can be removed once Core Web is moved to CF Workers.
] as const;
const DAPP_DEV_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'develop.core.app',
] as const;

const SYNCED_DOMAINS_PRODUCTION_BUILD = [CORE_WEB_DOMAIN] as const;
const SYNCED_DOMAINS_DEVELOPMENT_BUILD = [
  CORE_WEB_DOMAIN,
  ...CORE_WEB_STAGING_DOMAINS,
  ...DAPP_DEV_DOMAINS,
] as const;

export const KNOWN_CORE_DOMAINS = [
  CORE_WEB_DOMAIN,
  ...CORE_WEB_STAGING_DOMAINS,
  ...DAPP_DEV_DOMAINS,
] as const;

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
