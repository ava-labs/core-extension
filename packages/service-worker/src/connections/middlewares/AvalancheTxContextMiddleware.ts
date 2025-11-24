import { hex } from '@scure/base';
import { RpcMethod } from '@avalabs/vm-module-types';

import {
  JsonRpcRequest,
  JsonRpcResponse,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  PrimaryWalletSecrets,
  ExtendedPublicKey,
  AddressPublicKeyJson,
} from '@core/types';

import { AccountsService } from '~/services/accounts/AccountsService';
import { Middleware } from './models';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import getAddressByVM from '~/services/wallet/utils/getAddressByVM';
import { SecretsService } from '~/services/secrets/SecretsService';
import { getAvalancheExtendedKeyPath, isPrimaryAccount } from '@core/common';
import { NetworkService } from '~/services/network/NetworkService';

/**
 * This middleware appends the current address and xpubXP to the context.
 * It is currently needed by the Avalanche Module to generate signable
 * transactions based on the request parameters.
 */
export function AvalancheTxContextMiddleware(
  accountsService: AccountsService,
  secretsService: SecretsService,
  networkService: NetworkService,
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

    if (!isPrimaryAccount(activeAccount)) {
      context.account = {
        xpAddress: currentAddress ?? '',
        evmAddress: activeAccount.addressC,
        externalXPAddresses: [],
      };
      next();
      return;
    }

    const providerXP = await networkService.getAvalanceProviderXP();
    const secrets =
      await secretsService.getPrimaryAccountSecrets(activeAccount);

    if (!secrets) {
      error(new Error('Unable to locale public keys for the active account'));
      return;
    }

    // Find legacy X/P addresses that have been previously derived.
    const externalXPAddresses = secrets.publicKeys
      .filter(getPublicKeysLocator(activeAccount.index))
      .map(({ key, derivationPath }) => ({
        index: getLegacyXPAddressIndexFromPath(derivationPath),
        address: providerXP.getAddress(
          Buffer.from(hex.decode(key)),
          addressVM === 'PVM' ? 'P' : addressVM === 'AVM' ? 'X' : 'C',
        ),
      }));

    context.account = {
      xpAddress: currentAddress ?? '',
      evmAddress: activeAccount.addressC,
      xpubXP: findXpubXP(secrets, activeAccount.index),
      externalXPAddresses,
    };

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

const findXpubXP = (secrets: PrimaryWalletSecrets, index: number) => {
  const xpubXP =
    'extendedPublicKeys' in secrets
      ? secrets.extendedPublicKeys.find(getXPubLocator(index))
      : null;

  return xpubXP?.key;
};

const getXPubLocator = (index: number) => (key: ExtendedPublicKey) =>
  key.curve === 'secp256k1' &&
  key.derivationPath === getAvalancheExtendedKeyPath(index);

const getPublicKeysLocator = (index: number) => (key: AddressPublicKeyJson) =>
  key.curve === 'secp256k1' &&
  key.derivationPath.startsWith(`${getAvalancheExtendedKeyPath(index)}/`);

const getLegacyXPAddressIndexFromPath = (path: string) => {
  const lastSegment = path.split('/').pop();

  if (!lastSegment) {
    throw new Error('Invalid derivation path');
  }

  return parseInt(lastSegment);
};
