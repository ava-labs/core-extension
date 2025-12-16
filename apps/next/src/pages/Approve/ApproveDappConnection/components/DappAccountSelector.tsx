import { FC, useCallback, useEffect } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { Trans, useTranslation } from 'react-i18next';

import { Account, Action, ActionStatus, Permissions } from '@core/types';

import { NoScrollStack } from '@/components/NoScrollStack';
import { useDappScansCache } from '@/hooks/useDappScansCache';

import { ActionDrawer, LoadingScreen, NoteWarning } from '../../components';
import { ActionError, CancelActionFn, UpdateActionFn } from '../../types';

import { sanitizeDappUrl } from '../lib';
import { ConnectDappDisplayData } from '../types';
import { useDappPermissionsState } from '../hooks';
import { ConnectWalletCard, SizedAvatar } from '../components';
import { AlertType } from '@avalabs/vm-module-types';
import { isPrimaryAccount } from '@core/common';

type DappAccountSelectorProps = {
  activeAccount: Account;
  permissions: Permissions;
  action: Action<ConnectDappDisplayData>;
  updateAction: UpdateActionFn;
  cancelHandler: CancelActionFn;
  error: ActionError;
};

export const DappAccountSelector: FC<DappAccountSelectorProps> = ({
  action,
  updateAction,
  cancelHandler,
  activeAccount,
  permissions,
}) => {
  const { t } = useTranslation();
  const {
    wallets,
    isLoading,
    isSelected,
    toggleAccount,
    accountSettings,
    numberOfSelectedAccounts,
  } = useDappPermissionsState(activeAccount, permissions, action.displayData);
  const { storeMaliciousDappDomain } = useDappScansCache();

  const onApproveClicked = useCallback(async () => {
    if (!numberOfSelectedAccounts) {
      return;
    }

    const result = Array.from(
      accountSettings.entries().map(([id, enabled]) => ({ id, enabled })),
    );

    // If the app is malicious, save this data for later use.
    if (action.displayData.isMalicious) {
      storeMaliciousDappDomain(action.displayData.dappDomain);
    }

    updateAction({
      status: ActionStatus.SUBMITTING,
      id: action.actionId,
      result,
    });
  }, [
    numberOfSelectedAccounts,
    accountSettings,
    updateAction,
    action.actionId,
    action.displayData.dappDomain,
    action.displayData.isMalicious,
    storeMaliciousDappDomain,
  ]);

  useEffect(() => {
    if (action.displayData.canSkipApproval) {
      onApproveClicked();
    }
  }, [action.displayData.canSkipApproval, onApproveClicked]);

  if (action.displayData.canSkipApproval) {
    return <LoadingScreen />;
  }

  return (
    <NoScrollStack mt={5}>
      <Stack px={2} alignItems="center" gap={3}>
        <SizedAvatar size={60} src={action.displayData.dappIcon} />
        <Typography variant="body3" mx={5} textAlign="center">
          <Trans
            i18nKey="Do you want to allow <b>{{dappUrl}}</b> to access your wallet?"
            components={{
              b: <b />,
            }}
            values={{
              dappUrl: sanitizeDappUrl(action.displayData.dappUrl),
            }}
          />
        </Typography>
      </Stack>
      {action.displayData.isMalicious && (
        <Stack mt={2}>
          <NoteWarning
            alert={{
              type: AlertType.DANGER,
              details: {
                title: t('Scam application'),
                description: t(
                  'Use caution, this application might be malicious.',
                ),
              },
            }}
          />
        </Stack>
      )}
      <Stack width="100%" gap={1.5} mt={1.5} flexGrow={1} px={2}>
        {wallets.map((wallet) => (
          <ConnectWalletCard
            key={wallet.id}
            wallet={wallet}
            initiallyExpanded
            numberOfSelectedAccounts={numberOfSelectedAccounts}
            accountSettings={accountSettings}
            isSelected={isSelected}
            toggleAccount={toggleAccount}
            isLoading={isLoading}
            isActiveWallet={
              isPrimaryAccount(activeAccount) &&
              wallet.id === activeAccount.walletId
            }
          />
        ))}
      </Stack>
      <ActionDrawer
        open
        approve={onApproveClicked}
        reject={cancelHandler}
        isProcessing={action.status === ActionStatus.SUBMITTING}
        isDisabled={!numberOfSelectedAccounts}
        approveText={
          numberOfSelectedAccounts === 0
            ? t('Connect')
            : numberOfSelectedAccounts === 1
              ? t('Connect 1 account')
              : t('Connect {{count}} accounts', {
                  count: numberOfSelectedAccounts,
                })
        }
      />
    </NoScrollStack>
  );
};
