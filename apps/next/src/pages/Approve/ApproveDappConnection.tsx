import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC, useCallback, useEffect, useMemo } from 'react';

import {
  useAccountsContext,
  useApproveAction,
  useGetRequestId,
  usePermissionContext,
} from '@core/ui';
import { ActionStatus, DAppProviderRequest } from '@core/types';
import { mapAddressesToVMs } from '@core/common';

import {
  ActionDrawer,
  ApprovalScreenTitle,
  LoadingScreen,
  Styled,
} from './components';

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
    !permissions ||
    !action ||
    !activeAccount ||
    (isAccountPermissionGranted && !isWalletRequestPermissions)
  ) {
    return <LoadingScreen />;
  }

  return (
    <Styled.ApprovalScreenPage>
      <ApprovalScreenTitle title={action.displayData.title} />

      <Styled.NoScrollStack>
        <Stack flexGrow={1} px={2}>
          <Typography variant="h4">
            {t('🚧 Placeholder - needs implementation 🚧')}
          </Typography>
          <Typography variant="body1">
            {t('Approving will give this dApp access to your active account.')}
          </Typography>
        </Stack>
        <ActionDrawer
          open
          approve={onApproveClicked}
          reject={cancelHandler}
          isProcessing={action.status === ActionStatus.SUBMITTING}
        />
      </Styled.NoScrollStack>
    </Styled.ApprovalScreenPage>
  );
};
