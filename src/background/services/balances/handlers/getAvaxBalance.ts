import { Avalanche, BitcoinProvider } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { injectable } from 'tsyringe';
import { NetworkService } from '../../network/NetworkService';
import { BalancesServiceEVM } from '../BalancesServiceEVM';
import { NetworkTokenWithBalance } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCE_AVAX_GET,
  { balance: NetworkTokenWithBalance },
  [address: string]
>;

@injectable()
export class GetAvaxBalanceHandler implements HandlerType {
  method = ExtensionRequest.BALANCE_AVAX_GET as const;

  constructor(
    private networkService: NetworkService,
    private balancesServiceEVM: BalancesServiceEVM
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const params = request.params || [];
    const [address] = params;
    const avalancheNetwork = await this.networkService.getAvalancheNetwork();
    const provider = getProviderForNetwork(avalancheNetwork);
    if (
      provider instanceof BitcoinProvider ||
      provider instanceof Avalanche.JsonRpcProvider
    ) {
      return {
        ...request,
        error: 'no provider',
      };
    }

    const balance = await this.balancesServiceEVM.getNativeTokenBalance(
      provider,
      address,
      avalancheNetwork
    );

    return {
      ...request,
      result: { balance },
    };
  };
}
