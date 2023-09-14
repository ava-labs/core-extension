import { Glacier } from '@avalabs/glacier-sdk';
import { singleton } from 'tsyringe';
import { resolve } from '@avalabs/utils-sdk';
@singleton()
export class GlacierService {
  private glacierSdkInstance = new Glacier({ BASE: process.env.GLACIER_URL });
  private isGlacierHealthy = true;
  private supportedNetworks: string[] = [];

  private async getSupportedNetworks() {
    if (this.supportedNetworks.length) {
      return this.supportedNetworks;
    }

    try {
      const supportedNetworks =
        await this.glacierSdkInstance.evmChains.supportedChains({});
      this.supportedNetworks = supportedNetworks.chains.map(
        (chain) => chain.chainId
      );

      return this.supportedNetworks;
    } catch {
      return [];
    }
  }

  async isNetworkSupported(chainId: number) {
    if (!this.isGlacierHealthy) return this.isGlacierHealthy;
    const networks = await this.getSupportedNetworks();
    return networks.includes(chainId.toString());
  }

  constructor() {
    /**
     * This is for performance, basically we just cache the health of glacier every 5 seconds and
     * go off of that instead of every request
     */
    setInterval(async () => {
      const [healthStatus, healthStatusError] = await resolve(
        this.glacierSdkInstance.healthCheck.healthCheck()
      );

      if (healthStatusError) {
        this.isGlacierHealthy = false;
        return;
      }

      const status = healthStatus?.status?.toString();
      this.isGlacierHealthy = status === 'ok' ? true : false;
    }, 5000);

    this.getSupportedNetworks().catch(() => {
      // Noop. It will be retried by .isSupportedNetwork calls upon unlocking if necessary.
    });
  }
}
