import { NetworkVMType } from '@avalabs/vm-module-types';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { Trans, useTranslation } from 'react-i18next';
import { FC, useCallback, useEffect, useMemo } from 'react';

import {
  useAccountsContext,
  useApproveAction,
  useGetRequestId,
  usePermissionContext,
  WalletTotalBalanceProvider,
} from '@core/ui';
import { mapAddressesToVMs } from '@core/common';
import { ActionStatus, DAppProviderRequest } from '@core/types';

import { NoScrollStack } from '@/components/NoScrollStack';

import { ActionDrawer, LoadingScreen, Styled } from '../components';

import { useDappPermissionsState } from './hooks';
import { ConnectWalletCard, SizedAvatar } from './components';

export const ApproveDappConnection: FC = () => {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const { permissions, isDomainConnectedToAccount } = usePermissionContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const { action, cancelHandler, updateAction } = useApproveAction(requestId);
  const isRequestingAccess =
    action?.method === DAppProviderRequest.CONNECT_METHOD ||
    action?.method === DAppProviderRequest.WALLET_CONNECT;
  const isWalletRequestPermissions =
    action?.method === 'wallet_requestPermissions';

  const onApproveClicked = useCallback(async () => {
    if (!activeAccount) {
      return;
    }

    updateAction({
      status: ActionStatus.SUBMITTING,
      id: requestId,
      result: activeAccount.id,
    });
  }, [activeAccount, updateAction, requestId]);

  const activeAccountAddressForRequestedVM =
    activeAccount && action
      ? mapAddressesToVMs(activeAccount)[action?.displayData.addressVM]
      : null;

  const isAccountPermissionGranted = useMemo(
    () =>
      action &&
      activeAccountAddressForRequestedVM &&
      isDomainConnectedToAccount(action.displayData.domainUrl, [
        activeAccountAddressForRequestedVM,
      ]),
    [action, activeAccountAddressForRequestedVM, isDomainConnectedToAccount],
  );

  const { wallets, isLoading, isSelected, toggleAccount, selectedAccounts } =
    useDappPermissionsState(action?.displayData.addressVM ?? NetworkVMType.EVM);

  // If the domain already has permissions for the active account, close the popup
  useEffect(() => {
    if (isAccountPermissionGranted && isRequestingAccess) {
      if (activeAccount?.id) {
        // make sure we return a response even if the site was already approved
        updateAction({
          status: ActionStatus.SUBMITTING,
          id: requestId,
          result: activeAccount.id,
        });
      } else {
        window.close();
      }
    }
  }, [
    activeAccount?.id,
    isAccountPermissionGranted,
    isRequestingAccess,
    requestId,
    updateAction,
  ]);

  // Must also wait for isAccountPermissionGranted since `onApproveClicked` is async
  if (
    isLoading ||
    !permissions ||
    !action ||
    !activeAccount ||
    (isAccountPermissionGranted && !isWalletRequestPermissions)
  ) {
    return <LoadingScreen />;
  }

  return (
    <WalletTotalBalanceProvider>
      <Styled.ApprovalScreenPage>
        <NoScrollStack mt={5}>
          <Stack flexGrow={1} px={2} alignItems="center" gap={3}>
            <SizedAvatar size={60} src={action.displayData.dappIcon} />
            <Typography variant="body3" mx={5} textAlign="center">
              <Trans
                i18nKey="Do you want to allow <b>{{dappUrl}}</b> to access your wallet?"
                components={{
                  b: <b />,
                }}
                values={{
                  dappUrl: action.displayData.dappUrl,
                }}
              />
            </Typography>

            <Stack width="100%" gap={1.5} mt={1.5}>
              {wallets.map((wallet, index) => (
                <ConnectWalletCard
                  key={wallet.id}
                  wallet={wallet}
                  initiallyExpanded={index === 0}
                  selectedAccounts={selectedAccounts}
                  isSelected={isSelected}
                  toggleAccount={toggleAccount}
                  isLoading={isLoading}
                />
              ))}
            </Stack>
          </Stack>
          <ActionDrawer
            open
            approve={onApproveClicked}
            reject={cancelHandler}
            isProcessing={action.status === ActionStatus.SUBMITTING}
            isDisabled={!selectedAccounts.size}
            approveText={
              selectedAccounts.size === 0
                ? t('Connect')
                : selectedAccounts.size === 1
                  ? t('Connect 1 account')
                  : t('Connect {{count}} accounts', {
                      count: selectedAccounts.size,
                    })
            }
          />
        </NoScrollStack>
      </Styled.ApprovalScreenPage>
    </WalletTotalBalanceProvider>
  );
};
