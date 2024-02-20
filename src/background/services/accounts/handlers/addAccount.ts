import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
import { ImportData } from '../models';
import { isPrimaryAccount } from '../utils/typeGuards';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_ADD,
  string | undefined,
  { name?: string; importData?: ImportData; walletId?: string }
>;

@injectable()
export class AddAccountHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_ADD as const;

  constructor(private accountsService: AccountsService) {}

  handle: HandlerType['handle'] = async (request) => {
    const { name, importData, walletId } = request.params ?? [];

    try {
      let id = '';
      if (importData) {
        id = await this.accountsService.addImportedAccount({
          name,
          options: importData,
        });
      } else {
        const newAccountWalletId =
          walletId ||
          (isPrimaryAccount(this.accountsService.activeAccount) &&
            this.accountsService.activeAccount.walletId);

        if (!newAccountWalletId) {
          throw new Error('There is no wallet id for the new primary account');
        }
        id = await this.accountsService.addPrimaryAccount({
          name,
          walletId: newAccountWalletId,
        });
      }

      if (!id) {
        throw new Error('New account cannot be added');
      }

      return {
        ...request,
        result: id,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
