import { HypercoreInfoClient } from '@avalabs/hypercore-module';

export const getHypercoreInfoClient = () => {
  const proxyBase = process.env.PROXY_URL ?? 'https://proxy-api.avax.network';
  return new HypercoreInfoClient({
    infoUrl: `${proxyBase}/proxy/nownodes/hype/info`,
    activityInfoUrl: 'https://api.hyperliquid.xyz/info',
  });
};
