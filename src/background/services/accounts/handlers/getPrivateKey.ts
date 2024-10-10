import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { SecretsService } from '../../secrets/SecretsService';
import {
  getAddressDerivationPath,
  getWalletFromMnemonic,
} from '@avalabs/core-wallets-sdk';
import {
  AccountType,
  GetPrivateKeyErrorTypes,
  PrivateKeyChain,
} from '../models';
import { utils } from '@avalabs/avalanchejs';
import { LockService } from '../../lock/LockService';
import { SecretType } from '../../secrets/models';
import { AccountsService } from '../AccountsService';
import { mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';

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
    private accountsService: AccountsService
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
        const account = await this.secretService.getImportedAccountSecrets(
          accountId
        );

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

      const primaryAccount = await this.secretService.getPrimaryAccountSecrets(
        this.accountsService.activeAccount
      );

      if (
        !primaryAccount ||
        primaryAccount?.secretType !== SecretType.Mnemonic
      ) {
        return {
          ...request,
          error: {
            type: GetPrivateKeyErrorTypes.Mnemonic,
            message: 'There is no mnemonic found',
          },
        };
      }

      if (chain === PrivateKeyChain.XP) {
        const seed = mnemonicToSeedSync(primaryAccount.mnemonic);
        const master = fromSeed(seed);
        const pvmNode = master.derivePath(
          getAddressDerivationPath(
            accountIndex,
            primaryAccount.derivationPath,
            'PVM'
          )
        );
        if (!pvmNode.privateKey) {
          return {
            ...request,
            error: {
              type: GetPrivateKeyErrorTypes.DerivePath,
              message: 'The derive path is missing',
            },
          };
        }

        return {
          ...request,
          result: `0x${pvmNode.privateKey.toString('hex')}`,
        };
      }

      const signer = getWalletFromMnemonic(
        primaryAccount.mnemonic,
        accountIndex,
        primaryAccount.derivationPath
      );

      if (!signer || !signer.path) {
        return {
          ...request,
          error: {
            type: GetPrivateKeyErrorTypes.DerivePath,
            message: 'The derive path is missing',
          },
        };
      }

      const key = signer.privateKey;

      return {
        ...request,
        result: key,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
