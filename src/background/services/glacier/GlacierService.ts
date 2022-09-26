import { GlacierClient, ChainInfo } from '@avalabs/glacier-sdk';
import { singleton } from 'tsyringe';
import { Signal, ValueCache } from 'micro-signals';
import { resolve } from '@avalabs/utils-sdk';
const healthStatusCache = new ValueCache<boolean>();
const glacierNetworkHealthy = new Signal<boolean>();
@singleton()
export class GlacierService {
  private glacierSdkInstance = new GlacierClient(
    process.env.GLACIER_URL as string
  );
  private glacierNetworkHealthy = glacierNetworkHealthy;
  private supportedNetworks = this.glacierSdkInstance
    .supportedChains()
    .then((res) => {
      return res?.chains;
    })
    .then((chains: ChainInfo[]) => chains.map((chain) => chain.chainId));

  async isNetworkSupported(chainId: number) {
    const isNetworkHealthy = await this.glacierNetworkHealthy.promisify();
    if (!isNetworkHealthy) return isNetworkHealthy;
    const networks = await this.supportedNetworks;
    return networks.includes(chainId.toString());
  }
  constructor() {
    glacierNetworkHealthy.cache(healthStatusCache);
    /**
     * This is for performance, basically we just cache the health of glacier every 5 seconds and
     * go off of that instead of every request
     */
    setInterval(async () => {
      const [healthStatus] = await resolve(
        this.glacierSdkInstance.healthCheck()
      );
      const status = healthStatus?.status?.toString();
      this.glacierNetworkHealthy.dispatch(status === 'ok' ? true : false);
    }, 5000);
  }
}
