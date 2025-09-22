import { RpcMethod } from '@avalabs/vm-module-types';

import {
  JsonRpcRequest,
  JsonRpcResponse,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  AVALANCHE_BASE_DERIVATION_PATH,
  PrimaryWalletSecrets,
} from '@core/types';

import { AccountsService } from '~/services/accounts/AccountsService';
import { Middleware } from './models';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import getAddressByVM from '~/services/wallet/utils/getAddressByVM';
import { SecretsService } from '~/services/secrets/SecretsService';

/**
 * This middleware appends the current address and xpubXP to the context.
 * It is currently needed by the Avalanche Module to generate signable
 * transactions based on the request parameters.
 */
export function AvalancheTxContextMiddleware(
  accountsService: AccountsService,
  secretsService: SecretsService,
): Middleware<
  JsonRpcRequest | ExtensionConnectionMessage,
  JsonRpcResponse | ExtensionConnectionMessageResponse
> {
  return async (context, next, error) => {
    const {
      scope,
      request: { params, method },
    } = context.request.params;

    if (!scope) {
      next();
      return;
    }

    const addressVM = getRequiredAddressVM(method, params);

    if (!addressVM) {
      next();
      return;
    }

    const activeAccount = await accountsService.getActiveAccount();

    if (!activeAccount) {
      error(new Error('No active account'));
      return;
    }

    const currentAddress = getAddressByVM(addressVM, activeAccount);
    const secrets =
      await secretsService.getPrimaryAccountSecrets(activeAccount);

    context.currentAddress = currentAddress;
    context.currentEvmAddress = activeAccount.addressC;
    context.xpubXP = secrets ? findXpubXP(secrets) : undefined;

    next();
  };
}

const getRequiredAddressVM = (method: string, params: unknown) => {
  const isAvalancheSendTx =
    method === RpcMethod.AVALANCHE_SEND_TRANSACTION ||
    method === RpcMethod.AVALANCHE_SIGN_TRANSACTION;
  const hasChainAlias =
    params && typeof params === 'object' && 'chainAlias' in params;

  if (!isAvalancheSendTx || !hasChainAlias) {
    return undefined;
  }

  return Avalanche.getVmByChainAlias(params.chainAlias as string);
};

const findXpubXP = (secrets: PrimaryWalletSecrets) => {
  const xpubXP =
    secrets && 'extendedPublicKeys' in secrets
      ? secrets.extendedPublicKeys.find(
          (key) =>
            key.curve === 'secp256k1' &&
            key.derivationPath === AVALANCHE_BASE_DERIVATION_PATH,
        )
      : null;

  return xpubXP?.key;
};
