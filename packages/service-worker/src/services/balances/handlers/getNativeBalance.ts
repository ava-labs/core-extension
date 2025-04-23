import { ExtensionRequest } from '../../../connections/extensionConnection/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../../network/NetworkService';
import { BalancesService } from '../BalancesService';
import { AccountType } from '../../accounts/models';
import {
  NetworkTokenWithBalance,
  NetworkVMType,
  TokenType,
} from '@avalabs/vm-module-types';
import { mapVMAddresses } from '@core/utils';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BALANCE_NATIVE_GET,
  { balance: NetworkTokenWithBalance },
  [address: string, caip2Id: string]
>;

@injectable()
export class GetNativeBalanceHandler implements HandlerType {
  method = ExtensionRequest.BALANCE_NATIVE_GET as const;

  constructor(
    private networkService: NetworkService,
    private balancesService: BalancesService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const params = request.params || [];
    const [address, caip2Id] = params;
    const network = await this.networkService.getNetwork(caip2Id);

    if (!network) {
      return {
        ...request,
        error: 'network not found',
      };
    }

    const addresses = mapVMAddresses({
      [network.vmName]: address,
    } as Record<NetworkVMType, string>);

    const balances = await this.balancesService.getBalancesForNetwork(
      network,
      [
        // This handler is called during onboarding, when we don't have the accounts built yet,
        // hence we're building it on-the-spot here.
        {
          ...addresses,
          type: AccountType.IMPORTED,
          id: '',
          name: '',
          addressBTC: '',
        },
      ],
      [TokenType.NATIVE],
    );

    const nativeTokenWithBalance =
      balances[address]?.[network.networkToken.symbol];

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
