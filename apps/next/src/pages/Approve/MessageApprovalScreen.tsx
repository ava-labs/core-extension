import { FC, useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DetailItemType, RpcMethod } from '@avalabs/vm-module-types';
import { Avatar, Stack, Typography } from '@avalabs/k2-alpine';

import { useAccountsContext } from '@core/ui';
import { ActionStatus, NetworkWithCaipId } from '@core/types';

import { NoScrollStack } from '@/components/NoScrollStack';

import {
  ActionDetails,
  ActionDrawer,
  Styled,
  MaliciousTxOverlay,
  NoteWarning,
  ApprovalScreenTitle,
  HardwareApprovalOverlay,
} from './components';
import { hasNoteWarning, hasOverlayWarning } from './lib';
import {
  ActionError,
  CancelActionFn,
  hasDappInfo,
  MessageSigningRequest,
  UpdateActionFn,
} from './types';
import { DetailsSection } from './components/ActionDetails/generic/DetailsSection';
import { NetworkDetail } from './components/ActionDetails/generic/DetailsItem/items/NetworkDetail';
import { AddressDetail } from './components/ActionDetails/generic/DetailsItem/items/AddressDetail';
import { getAddressByVMType } from '@core/common';
import { useIsUsingHardwareWallet } from '@/hooks/useIsUsingHardwareWallet';
import { useApprovalHelpers } from './hooks';
import { sanitizeDappUrl } from './ApproveDappConnection/lib';

type MessageApprovalScreenProps = {
  action: MessageSigningRequest;
  network: NetworkWithCaipId;
  updateAction: UpdateActionFn;
  cancelHandler: CancelActionFn;
  error: ActionError;
};

export const MessageApprovalScreen: FC<MessageApprovalScreenProps> = ({
  action,
  network,
  updateAction,
  cancelHandler,
  error,
}) => {
  const { t } = useTranslation();
  const {
    getAccountByIndex,
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const { isUsingHardwareWallet, deviceType } = useIsUsingHardwareWallet();

  const approve = useCallback(
    async () =>
      updateAction(
        {
          status: ActionStatus.SUBMITTING,
          id: action.actionId,
        },
        isUsingHardwareWallet,
      ),
    [updateAction, action.actionId, isUsingHardwareWallet],
  );

  const { handleApproval, handleRejection, isApprovalOverlayVisible } =
    useApprovalHelpers({
      onApprove: approve,
      onReject: cancelHandler,
      isUsingHardwareWallet,
      deviceType,
    });

  const address = useMemo(() => {
    if (action.displayData.account) {
      return action.displayData.account;
    }

    if (action.signingData.type === RpcMethod.AVALANCHE_SIGN_MESSAGE) {
      const accountIndex = action.signingData.accountIndex;

      const account =
        typeof accountIndex === 'number'
          ? getAccountByIndex(accountIndex)
          : activeAccount;

      return account ? getAddressByVMType(account, network.vmName) : undefined;
    }

    return undefined;
  }, [
    action.displayData.account,
    action.signingData,
    getAccountByIndex,
    activeAccount,
    network.vmName,
  ]);

  return (
    <Styled.ApprovalScreenPage>
      <NoScrollStack>
        {hasDappInfo(action) ? (
          <Stack
            mt={5}
            py={2}
            px={6}
            gap={3}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Avatar
              src={action.dappInfo.icon}
              sx={{ width: 60, height: 60, background: 'transparent' }}
            />
            <Typography variant="body3">
              <Trans
                i18nKey={`<b>{{dappUrl}}</b> is requesting to sign the following message`}
                components={{
                  b: <b />,
                }}
                values={{ dappUrl: sanitizeDappUrl(action.dappInfo.url) }}
              />
            </Typography>
          </Stack>
        ) : (
          <ApprovalScreenTitle title={t('Do you want to sign this message?')} />
        )}

        {hasNoteWarning(action) && (
          <NoteWarning alert={action.displayData.alert} />
        )}

        <Stack flexGrow={1} px={2} gap={1.5}>
          {(address || action.displayData.network) && (
            <DetailsSection>
              {address && (
                <AddressDetail
                  item={{
                    label: t('Account'),
                    type: DetailItemType.ADDRESS,
                    value: address,
                  }}
                />
              )}
              {action.displayData.network && (
                <NetworkDetail
                  item={{
                    label: t('Network'),
                    type: DetailItemType.NETWORK,
                    value: {
                      logoUri: action.displayData.network.logoUri,
                      name: action.displayData.network.name,
                    },
                  }}
                />
              )}
            </DetailsSection>
          )}
          <ActionDetails
            network={network}
            action={action}
            updateAction={updateAction}
            error={error}
          />
        </Stack>
        <ActionDrawer
          open
          approve={handleApproval}
          reject={handleRejection}
          isProcessing={action.status === ActionStatus.SUBMITTING}
          withConfirmationSwitch={hasOverlayWarning(action)}
        />
      </NoScrollStack>
      {hasOverlayWarning(action) && (
        <MaliciousTxOverlay
          open={hasOverlayWarning(action)}
          cancelHandler={cancelHandler}
          alert={action.displayData.alert}
        />
      )}
      {isUsingHardwareWallet && isApprovalOverlayVisible && deviceType && (
        <HardwareApprovalOverlay
          deviceType={deviceType}
          action={action}
          network={network}
          approve={approve}
          reject={cancelHandler}
        />
      )}
    </Styled.ApprovalScreenPage>
  );
};
