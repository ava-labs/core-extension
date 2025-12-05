import { injectable } from 'tsyringe';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { calculateTotalAtomicFundsForAccounts } from '@core/common';

import { BalanceAggregatorService } from '~/services/balances/BalanceAggregatorService';
import { AccountsService } from '~/services/accounts/AccountsService';
import { getAvaxPrice } from '~/services/balances/handlers/helpers';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.GET_ATOMIC_FUNDS_FOR_ACCOUNT,
  { sum: number; sumInCurrency: number },
  { accountId: string }
>;

@injectable()
export class GetTotalAtomicFundsForAccountHandler implements HandlerType {
  method = ExtensionRequest.GET_ATOMIC_FUNDS_FOR_ACCOUNT as const;

  constructor(
    private balanceAggregatorService: BalanceAggregatorService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const { accountId } = request.params;

    const primaryAccounts = Object.values(
      (await this.accountsService.getAccounts()).primary,
    ).flat();
    const selectedAccount = primaryAccounts.find(
      (account) => account.id === accountId,
    );

    if (!selectedAccount) {
      return {
        ...request,
        result: {
          sum: 0,
          sumInCurrency: 0,
        },
      };
    }

    const accountsOfInterest = [
      selectedAccount.addressCoreEth,
      selectedAccount.addressAVM,
      selectedAccount.addressPVM,
    ];

    const { atomicBalances } = this.balanceAggregatorService;

    const tokenUnit = calculateTotalAtomicFundsForAccounts(
      atomicBalances,
      accountsOfInterest,
    );
    const avaxPrice = getAvaxPrice(atomicBalances);

    return {
      ...request,
      result: {
        sum: tokenUnit.toDisplay({ asNumber: true }),
        sumInCurrency: tokenUnit.toDisplay({ asNumber: true }) * avaxPrice,
      },
    };
  };
}
