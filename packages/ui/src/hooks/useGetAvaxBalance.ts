import { GetNativeBalanceHandler } from '@core/service-worker';
import { ExtensionRequest } from '@core/service-worker';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

export function useGetAvaxBalance() {
  const { request } = useConnectionContext();
  async function getAvaxBalance(address: string) {
    const result = await request<GetNativeBalanceHandler>({
      method: ExtensionRequest.BALANCE_NATIVE_GET,
      params: [address, 'eip155:43114'],
    });
    return result;
  }

  return {
    getAvaxBalance,
  };
}
