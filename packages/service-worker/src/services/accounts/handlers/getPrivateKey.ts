import {
  ExtensionRequest,
  ExtensionRequestHandler,
  AccountType,
  GetPrivateKeyErrorTypes,
  PrivateKeyChain,
  SecretType,
} from '@core/types';
import { injectable } from 'tsyringe';
import { SecretsService } from '../../secrets/SecretsService';
import { getAddressDerivationPath } from '@avalabs/core-wallets-sdk';
import { utils } from '@avalabs/avalanchejs';
import { LockService } from '../../lock/LockService';
import { AccountsService } from '../AccountsService';
import { mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import { getAccountPrivateKeyFromMnemonic } from '../../secrets/utils/getAccountPrivateKeyFromMnemonic';

interface GetPrivateKeyHandlerParamsProps {
  type: SecretType.Mnemonic | AccountType.IMPORTED;
  index: number;
  id: string;
  password: string;
  chain: PrivateKeyChain;
}

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_GET_PRIVATEKEY,
  string | null,
  [GetPrivateKeyHandlerParamsProps]
>;

@injectable()
export class GetPrivateKeyHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_GET_PRIVATEKEY as const;

  constructor(
    private secretService: SecretsService,
    private lockService: LockService,
    private accountsService: AccountsService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [params] = request.params;
    const {
      type,
      index: accountIndex,
      id: accountId,
      password,
      chain,
    } = params;

    if (!chain || ![PrivateKeyChain.C, PrivateKeyChain.XP].includes(chain)) {
      return {
        ...request,
        error: {
          type: GetPrivateKeyErrorTypes.Chain,
          message: 'Invalid chain',
        },
      };
    }

    if (!password) {
      return {
        ...request,
        error: {
          type: GetPrivateKeyErrorTypes.Password,
          message: 'The password is invalid',
        },
      };
    }

    const validPassword = await this.lockService.verifyPassword(password);

    if (!validPassword) {
      return {
        ...request,
        error: {
          type: GetPrivateKeyErrorTypes.Password,
          message: 'The password is invalid',
        },
      };
    }

    if (type !== SecretType.Mnemonic && type !== AccountType.IMPORTED) {
      return {
        ...request,
        error: { type: GetPrivateKeyErrorTypes.Type, message: 'Invalid type' },
      };
    }

    try {
      if (type === AccountType.IMPORTED) {
        const account =
          await this.secretService.getImportedAccountSecrets(accountId);

        if (account?.secretType === SecretType.PrivateKey) {
          return {
            ...request,
            result: utils.add0x(account.secret),
          };
        } else {
          return {
            ...request,
            error: {
              type: GetPrivateKeyErrorTypes.Type,
              message: 'Invalid type',
            },
          };
        }
      }

      const account = await this.accountsService.getAccountByID(accountId);

      if (!account) {
        return {
          ...request,
          error: {
            type: GetPrivateKeyErrorTypes.Mnemonic,
            message: 'Mnemonic not found',
          },
        };
      }

      const primaryAccount =
        await this.secretService.getPrimaryAccountSecrets(account);

      if (
        !primaryAccount ||
        primaryAccount?.secretType !== SecretType.Mnemonic
      ) {
        return {
          ...request,
          error: {
            type: GetPrivateKeyErrorTypes.Mnemonic,
            message: 'Mnemonic not found',
          },
        };
      }

      if (chain === PrivateKeyChain.XP) {
        const seed = mnemonicToSeedSync(primaryAccount.mnemonic);
        const master = fromSeed(seed);
        const pvmNode = master.derivePath(
          getAddressDerivationPath(accountIndex, 'PVM'),
        );
        if (!pvmNode.privateKey) {
          return {
            ...request,
            error: {
              type: GetPrivateKeyErrorTypes.DerivePath,
              message: 'The derived path is missing',
            },
          };
        }

        return {
          ...request,
          result: `0x${pvmNode.privateKey.toString('hex')}`,
        };
      }

      try {
        return {
          ...request,
          result: getAccountPrivateKeyFromMnemonic(
            primaryAccount.mnemonic,
            accountIndex,
            primaryAccount.derivationPathSpec,
          ),
        };
      } catch (e) {
        return {
          ...request,
          error: {
            type: GetPrivateKeyErrorTypes.DerivePath,
            message: e,
          },
        };
      }
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
