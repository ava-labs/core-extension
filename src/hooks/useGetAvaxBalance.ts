import { GetNativeBalanceHandler } from '@src/background/services/balances/handlers/getNativeBalance';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
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
