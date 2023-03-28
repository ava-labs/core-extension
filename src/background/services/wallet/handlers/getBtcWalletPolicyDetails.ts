import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { AccountType } from '../../accounts/models';
import { WalletService } from '../WalletService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_GET_BTC_WALLET_POLICY_DETAILS,
  { masterFingerprint?: string } | undefined
>;

@injectable()
export class GetBtcWalletPolicyDetails implements HandlerType {
  method = ExtensionRequest.WALLET_GET_BTC_WALLET_POLICY_DETAILS as const;

  constructor(
    private walletService: WalletService,
    private accountService: AccountsService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    try {
      const activeAccount = this.accountService.activeAccount;

      if (!activeAccount) {
        throw new Error('no account selected');
      }

      if (activeAccount.type !== AccountType.PRIMARY) {
        throw new Error('incorrect account type');
      }

      const btcWalletPolicyDetails =
        await this.walletService.getBtcWalletPolicyDetails(activeAccount);

      return {
        ...request,
        result: {
          masterFingerprint: btcWalletPolicyDetails?.masterFingerprint,
        },
      };
    } catch (err) {
      return {
        ...request,
        result: undefined,
      };
    }
  };
}
