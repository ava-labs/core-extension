import { GetAvaxBalanceHandler } from '@src/background/services/balances/handlers/getAvaxBalance';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

export function useGetAvaxBalance() {
  const { request } = useConnectionContext();
  async function getAvaxBalance(address: string) {
    const result = await request<GetAvaxBalanceHandler>({
      method: ExtensionRequest.BALANCE_AVAX_GET,
      params: [address],
    });
    return result;
  }

  return {
    getAvaxBalance,
  };
}
