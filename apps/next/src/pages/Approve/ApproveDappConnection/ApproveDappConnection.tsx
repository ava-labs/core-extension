import { FC, useEffect, useMemo } from 'react';

import {
  useAccountsContext,
  useApproveAction,
  useGetRequestId,
  usePermissionContext,
  WalletTotalBalanceProvider,
} from '@core/ui';
import { mapAddressesToVMs } from '@core/common';
import { ActionStatus, DAppProviderRequest } from '@core/types';

import { LoadingScreen, MaliciousDappOverlay, Styled } from '../components';

import { isDappConnectAction } from './lib';
import { DappAccountSelector } from './components';

export const ApproveDappConnection: FC = () => {
  const requestId = useGetRequestId();
  const { permissions, isDomainConnectedToAccount } = usePermissionContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const { action, cancelHandler, updateAction, error } =
    useApproveAction(requestId);

  const isRequestingAdditionalAccess =
    action?.method === DAppProviderRequest.WALLET_PERMISSIONS;

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

  // If the domain already has permissions for the active account, close the popup
  useEffect(() => {
    if (isAccountPermissionGranted && !isRequestingAdditionalAccess) {
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
    requestId,
    updateAction,
    isRequestingAdditionalAccess,
  ]);

  // Must also wait for isAccountPermissionGranted since `onApproveClicked` is async
  if (
    !permissions ||
    !action ||
    !action.displayData ||
    !activeAccount ||
    !isDappConnectAction(action)
  ) {
    return <LoadingScreen />;
  }

  return (
    <Styled.ApprovalScreenPage>
      <WalletTotalBalanceProvider>
        {action.displayData.isMalicious && (
          <MaliciousDappOverlay
            open={action.displayData.isMalicious}
            cancelHandler={cancelHandler}
          />
        )}
        <DappAccountSelector
          action={action}
          activeAccount={activeAccount}
          permissions={permissions}
          updateAction={updateAction}
          cancelHandler={cancelHandler}
          error={error}
        />
      </WalletTotalBalanceProvider>
    </Styled.ApprovalScreenPage>
  );
};
