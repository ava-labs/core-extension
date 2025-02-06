import { Avalanche, BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { injectable } from 'tsyringe';
import { NetworkService } from '../../network/NetworkService';
import { BalancesService } from '../BalancesService';
import { AccountType } from '../../accounts/models';
import { NetworkTokenWithBalance, TokenType } from '@avalabs/vm-module-types';

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
    private balancesService: BalancesService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const params = request.params || [];
    const [address] = params;
    const avalancheNetwork = await this.networkService.getAvalancheNetwork();
    const provider = await getProviderForNetwork(avalancheNetwork);
    if (
      provider instanceof BitcoinProvider ||
      provider instanceof Avalanche.JsonRpcProvider
    ) {
      return {
        ...request,
        error: 'no provider',
      };
    }

    const balances = await this.balancesService.getBalancesForNetwork(
      avalancheNetwork,
      [
        // This handler is called during onboarding, when we don't have the accounts built yet,
        // hence we're building it on-the-spot here.
        {
          addressC: address,
          type: AccountType.IMPORTED,
          id: '',
          name: '',
          addressBTC: '',
        },
      ],
      [TokenType.NATIVE],
    );

    const nativeTokenWithBalance =
      balances[address]?.[avalancheNetwork.networkToken.symbol];

    if (nativeTokenWithBalance?.type !== TokenType.NATIVE) {
      return {
        ...request,
        error: 'unable to fetch balance',
      };
    }

    return {
      ...request,
      result: { balance: nativeTokenWithBalance },
    };
  };
}
