import { isProductionBuild } from '@core/utils';

const CORE_WEB_DOMAIN = 'core.app' as const;
const CORE_WEB_TESTNET_DOMAIN = 'test.core.app' as const;
const CORE_WEB_STAGING_DOMAIN = 'core-web.pages.dev' as const;
const DAPP_DEV_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'redesign-aa3.pages.dev',
] as const;

const SYNCED_DOMAINS_PRODUCTION_BUILD = [CORE_WEB_DOMAIN] as const;
const SYNCED_DOMAINS_DEVELOPMENT_BUILD = [
  CORE_WEB_DOMAIN,
  CORE_WEB_TESTNET_DOMAIN,
  CORE_WEB_STAGING_DOMAIN,
  ...DAPP_DEV_DOMAINS,
] as const;

export const SYNCED_DOMAINS = isProductionBuild()
  ? SYNCED_DOMAINS_PRODUCTION_BUILD
  : SYNCED_DOMAINS_DEVELOPMENT_BUILD;
