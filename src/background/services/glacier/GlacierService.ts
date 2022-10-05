import { GlacierClient, ChainInfo } from '@avalabs/glacier-sdk';
import { singleton } from 'tsyringe';
import { resolve } from '@avalabs/utils-sdk';
@singleton()
export class GlacierService {
  private glacierSdkInstance = new GlacierClient(
    process.env.GLACIER_URL as string
  );
  private isGlacierHealthy = true;
  private supportedNetworks = this.glacierSdkInstance
    .supportedChains()
    .then((res) => {
      return res?.chains;
    })
    .then((chains: ChainInfo[]) => chains.map((chain) => chain.chainId));

  async isNetworkSupported(chainId: number) {
    if (!this.isGlacierHealthy) return this.isGlacierHealthy;
    const networks = await this.supportedNetworks;
    return networks.includes(chainId.toString());
  }
  constructor() {
    /**
     * This is for performance, basically we just cache the health of glacier every 5 seconds and
     * go off of that instead of every request
     */
    setInterval(async () => {
      const [healthStatus] = await resolve(
        this.glacierSdkInstance.healthCheck()
      );
      const status = healthStatus?.status?.toString();
      this.isGlacierHealthy = status === 'ok' ? true : false;
    }, 5000);
  }
}
