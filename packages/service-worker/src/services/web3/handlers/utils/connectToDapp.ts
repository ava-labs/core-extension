import { NetworkVMType } from '@avalabs/vm-module-types';
import { getAddressByVMType } from '@core/common';
import { Action, isVMCapableAccount } from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '~/services/accounts/AccountsService';
import { PermissionsService } from '~/services/permissions/PermissionsService';
import { getPermissionsConvertedToMetaMaskStructure } from '~/services/permissions/utils/getPermissionsConvertedToMetaMaskStructure';

type ResultType = string[] | { invoker: string; parentCapability: string }[];
type BaseCallbackArgs<T> = {
  pendingAction: Action;
  result: T;
  onSuccess: (result: ResultType) => void;
  onError: (error: Error) => void;
};
type AccountPayload = {
  id: string;
  enabled: boolean;
};
type LegacyCallbackArgs = BaseCallbackArgs<string>;
type CallbackArgs = BaseCallbackArgs<AccountPayload[]>;

type GetDappConnectorArgs = {
  accountsService: AccountsService;
  permissionsService: PermissionsService;
  vm: NetworkVMType;
  convertToMetaMaskStructure?: boolean;
};

export const getLegacyDappConnector =
  ({
    accountsService,
    permissionsService,
    vm,
    convertToMetaMaskStructure = false,
  }: GetDappConnectorArgs) =>
  async ({ pendingAction, result, onError, onSuccess }: LegacyCallbackArgs) => {
    const selectedAccount = await accountsService.getAccountByID(result);

    if (!selectedAccount) {
      onError(ethErrors.rpc.internal('Selected account not found'));
      return;
    }

    if (convertToMetaMaskStructure && vm !== NetworkVMType.EVM) {
      onError(
        ethErrors.rpc.internal(
          'Cannot convert to MetaMask structure for non-EVM requests',
        ),
      );
      return;
    }

    if (!pendingAction?.site?.domain) {
      onError(ethErrors.rpc.internal('Domain not set'));
      return;
    }

    const address = getAddressByVMType(selectedAccount, vm);

    if (!address) {
      onError(
        ethErrors.rpc.internal(
          'The active account does not support the requested VM',
        ),
      );
      return;
    }

    const activeAccount = await accountsService.getActiveAccount();
    // The site was already approved
    // We usually get here when an already approved site attempts to connect
    // and the extension was locked in the meantime
    if (
      activeAccount &&
      activeAccount.id === result &&
      (await permissionsService.hasDomainPermissionForAccount(
        pendingAction.site.domain,
        activeAccount,
        vm,
      ))
    ) {
      onSuccess([address]);
      return;
    }

    const permissions = await permissionsService.grantPermission(
      pendingAction.site.domain,
      address,
      vm,
    );

    await accountsService.activateAccount(result);

    if (convertToMetaMaskStructure) {
      onSuccess(
        getPermissionsConvertedToMetaMaskStructure(
          result,
          pendingAction.site.domain,
          permissions,
        ),
      );
    } else {
      onSuccess([address]);
    }
  };

export const getDappConnector =
  ({ accountsService, permissionsService, vm }: GetDappConnectorArgs) =>
  async ({
    pendingAction,
    result: accountSettings,
    onError,
    onSuccess,
  }: CallbackArgs) => {
    const enabledAccounts = accountSettings.filter(({ enabled }) => enabled);

    if (enabledAccounts.length === 0 || !enabledAccounts[0]) {
      onError(ethErrors.rpc.invalidRequest('Selected account not found'));
      return;
    }

    if (!pendingAction?.site?.domain) {
      onError(ethErrors.rpc.internal('Domain not set'));
      return;
    }

    const activeAccount = await accountsService.getActiveAccount();

    if (!activeAccount) {
      onError(ethErrors.rpc.internal('No active account'));
      return;
    }

    const selectedAccounts = await Promise.all(
      accountSettings.map(async (payload) => {
        const account = await accountsService.getAccountByID(payload.id);

        if (!account) {
          return undefined;
        }

        return {
          account,
          enabled: payload.enabled,
        };
      }),
    );
    const vmCapableAccounts = selectedAccounts
      .filter((payload) => payload !== undefined)
      .filter(({ account }) => isVMCapableAccount(vm, account));

    // Even though the UI should already prevent the user from selecting VM-incompatible accounts,
    // we double-check if at least one of the selected accounts support the requested VM
    if (vmCapableAccounts.length === 0 || !vmCapableAccounts[0]) {
      onError(
        ethErrors.rpc.internal(
          'None of the selected accounts support the requested VM',
        ),
      );
      return;
    }

    const accountToActivate = isVMCapableAccount(vm, activeAccount)
      ? activeAccount
      : vmCapableAccounts[0].account;

    await permissionsService.updateAccessForDomain({
      domain: pendingAction.site.domain,
      accounts: vmCapableAccounts,
      notifiedVMConnectors: [vm],
    });

    if (accountToActivate.id !== activeAccount.id) {
      await accountsService.activateAccount(accountToActivate.id);
    }

    const addressForRequestedVM = getAddressByVMType(accountToActivate, vm);

    if (!addressForRequestedVM) {
      // Should never happen, but let's satisfy TypeScript
      onError(
        ethErrors.rpc.internal(
          'The selected account does not support the requested VM',
        ),
      );
      return;
    }

    onSuccess([addressForRequestedVM]);
  };
