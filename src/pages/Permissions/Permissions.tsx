import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Typography,
  Button,
  LoadingDots,
  Stack,
  Box,
  useTheme,
  GlobeIcon,
} from '@avalabs/k2-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { Account } from '@src/background/services/accounts/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import { usePermissionContext } from '@src/contexts/PermissionsProvider';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { SiteAvatarK2 } from '@src/components/common/SiteAvatar';
import { ActionStatus } from '@src/background/services/actions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useTranslation } from 'react-i18next';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { AccountsDropdown } from './components/AccountsDropdown';

export function PermissionsPage() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const { permissions, isDomainConnectedToAccount } = usePermissionContext();
  const theme = useTheme();
  const {
    accounts: { active: activeAccount },
    allAccounts,
  } = useAccountsContext();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const isConfirmContainer = useIsSpecificContextContainer(
    ContextContainer.CONFIRM
  );

  const {
    action: request,
    cancelHandler,
    updateAction,
  } = useApproveAction(requestId);
  const isSubmitting = request?.status === ActionStatus.SUBMITTING;

  const isEthRequestAccounts = request?.method === 'eth_requestAccounts';
  const isWalletRequestPermissions =
    request?.method === 'wallet_requestPermissions';

  const onApproveClicked = useCallback(async () => {
    if (!selectedAccount) {
      return;
    }

    updateAction({
      status: ActionStatus.SUBMITTING,
      id: requestId,
      result: selectedAccount.id,
    });
  }, [selectedAccount, updateAction, requestId]);

  const isAccountPermissionGranted = useMemo(
    () =>
      request &&
      activeAccount &&
      isDomainConnectedToAccount(
        request.displayData.domainUrl,
        activeAccount.addressC
      ) &&
      isConfirmContainer,
    [request, activeAccount, isDomainConnectedToAccount, isConfirmContainer]
  );

  // If the domain already has permissions for the active account, close the popup
  useEffect(() => {
    if (isAccountPermissionGranted && isEthRequestAccounts) {
      window.close();
    }
  }, [isAccountPermissionGranted, isEthRequestAccounts]);

  // Must also wait for isAccountPermissionGranted since `onApproveClicked` is async
  if (
    !permissions ||
    !request ||
    (isAccountPermissionGranted && !isWalletRequestPermissions)
  ) {
    return <LoadingDots size={20} />;
  }

  return (
    <Stack
      sx={{
        width: '100%',
        px: 2,
        color: theme.palette.text.primary,
        justifyContent: 'space-between',
      }}
    >
      <Stack sx={{ gap: 3, py: 1.5 }}>
        <Box sx={{ width: '100%' }}>
          <Typography component="h1" sx={{ fontSize: 24, fontWeight: 'bold' }}>
            {t('Connect Core to Dapp')}
          </Typography>
        </Box>
        <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
          <SiteAvatarK2 margin="0">
            <TokenIcon
              height="48px"
              width="48px"
              src={request.displayData.domainIcon}
            >
              <GlobeIcon size={48} color={theme.palette.text.secondary} />
            </TokenIcon>
          </SiteAvatarK2>
          <Stack textAlign="center" gap={0.5}>
            <Typography component="h2" variant="h5">
              {request.displayData.domainName}
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: theme.palette.text.secondary }}
            >
              {request.displayData.domainUrl}
            </Typography>
          </Stack>
        </Stack>
        <AccountsDropdown
          accounts={allAccounts}
          activeAccount={activeAccount}
          onSelectedAccountChanged={(acc) => setSelectedAccount(acc)}
        />
      </Stack>
      <Stack
        sx={{
          width: '100%',
          justifyContent: 'space-between',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            mb: 2,
            color: theme.palette.text.secondary,
          }}
          paragraph
        >
          {t('Only connect to sites that you trust.')}
        </Typography>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Button
            color="secondary"
            data-testid="connect-reject-btn"
            onClick={() => {
              cancelHandler();
              window.close();
            }}
            sx={{ width: 168, maxHeight: 40, height: 40 }}
            disabled={isSubmitting}
          >
            {t('Reject')}
          </Button>
          <Button
            data-testid="connect-approve-btn"
            onClick={() => onApproveClicked()}
            sx={{ width: 168, maxHeight: 40, height: 40 }}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? '' : t('Approve')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
