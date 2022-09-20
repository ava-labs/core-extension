import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { GetAvalancheNetworkHandler } from '@src/background/services/network/handlers/getAvalancheNetwork';

export function useGetAvalancheNetwork() {
  const { request } = useConnectionContext();
  async function getAvalancheNetwork() {
    const result = await request<GetAvalancheNetworkHandler>({
      method: ExtensionRequest.NETWORK_AVALANCHE_GET,
    });
    return result;
  }

  return {
    getAvalancheNetwork,
  };
}
