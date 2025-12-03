import {
  ExtensionRequest,
  ExtensionRequestHandler,
  XPAddresses,
} from '@core/types';
import { injectable } from 'tsyringe';
import { isPrimaryAccount } from '@core/common';
import { AddressResolver } from '~/services/secrets/AddressResolver';
import { AccountsService } from '../AccountsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_GET_XP_ADDRESSES,
  XPAddresses,
  { id: string; vm: 'AVM' | 'PVM' }
>;

@injectable()
export class GetXPAddressesForAccountHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_GET_XP_ADDRESSES as const;

  constructor(
    private readonly accountsService: AccountsService,
    private readonly addressResolver: AddressResolver,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { id, vm } = request.params;
    const account = await this.accountsService.getAccountByID(id);

    if (!account) {
      return {
        ...request,
        error: 'Account not found',
      };
    }

    if (!isPrimaryAccount(account)) {
      return {
        ...request,
        result: {
          externalAddresses: [],
          internalAddresses: [],
        },
      };
    }

    try {
      const addresses =
        await this.addressResolver.getXPAddressesForAccountIndex(
          account.walletId,
          account.index,
          vm,
        );

      return {
        ...request,
        result: addresses,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
