import { SiteAvatar } from '@/components/common/SiteAvatar';
import { TokenIcon } from '@/components/common/TokenIcon';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { useFeatureFlagContext } from '@/contexts/FeatureFlagsProvider';
import { usePermissionContext } from '@/contexts/PermissionsProvider';
import { useApproveAction } from '@/hooks/useApproveAction';
import { BlockaidData, useDAppScan } from '@/hooks/useDAppScan';
import { useGetRequestId } from '@/hooks/useGetRequestId';
import { useIsSpecificContextContainer } from '@/hooks/useIsSpecificContextContainer';
import {
  Box,
  Button,
  GlobeIcon,
  LoadingDots,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { NetworkVMType } from '@avalabs/vm-module-types';
import {
  Account,
  ActionStatus,
  ContextContainer,
  DAppProviderRequest,
  FeatureGates,
} from '@core/types';
import { mapAddressesToVMs } from '@core/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountsDropdown } from './components/AccountsDropdown';
import { AlertBox } from './components/AlertBox';
import { AlertDialog } from './components/AlertDialog';
import { WarningBox } from './components/WarningBox';

export function PermissionsPage() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const { permissions, isDomainConnectedToAccount } = usePermissionContext();
  const theme = useTheme();
  const {
    accounts: { active: activeAccount },
    getAllAccountsForVM,
  } = useAccountsContext();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const [dAppScanningResult, setDAppScanningResult] = useState<
    BlockaidData | undefined
  >(undefined);

  const [displayDialog, setDisplayDialog] = useState(true);

  const isConfirmContainer = useIsSpecificContextContainer(
    ContextContainer.CONFIRM,
  );
  const dAppScanning = useDAppScan();
  const { featureFlags } = useFeatureFlagContext();

  const { action, cancelHandler, updateAction } = useApproveAction(requestId);
  const isSubmitting = action?.status === ActionStatus.SUBMITTING;
  const isRequestingAccess =
    action?.method === DAppProviderRequest.CONNECT_METHOD ||
    action?.method === DAppProviderRequest.WALLET_CONNECT;
  const isWalletRequestPermissions =
    action?.method === 'wallet_requestPermissions';

  useEffect(() => {
    if (action?.site?.domain) {
      dAppScanning(action.site.domain)
        .then((result) => {
          setDAppScanningResult(result);
        })
        .catch((e) => console.error(e));
    }
  }, [dAppScanning, action?.site?.domain]);

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
      ]) &&
      isConfirmContainer,
    [
      action,
      activeAccountAddressForRequestedVM,
      isDomainConnectedToAccount,
      isConfirmContainer,
    ],
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

  const allAccountsForRequestedVM = getAllAccountsForVM(
    action?.displayData?.addressVM ?? NetworkVMType.EVM,
  );

  // Must also wait for isAccountPermissionGranted since `onApproveClicked` is async
  if (
    !permissions ||
    !action ||
    allAccountsForRequestedVM.length === 0 ||
    !activeAccount ||
    (isAccountPermissionGranted && !isWalletRequestPermissions)
  ) {
    return <LoadingDots size={20} />;
  }

  const isMaliciousDApp = dAppScanningResult && dAppScanningResult.isMalicious;
  const isMissingBlockaidData =
    dAppScanningResult && dAppScanningResult?.status === 'miss' ? true : false;

  return (
    <>
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
            <Typography variant="h4">{t('Connect Core to Dapp')}</Typography>
          </Box>
          <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
            {featureFlags[FeatureGates.BLOCKAID_DAPP_SCAN] &&
              isMaliciousDApp && (
                <AlertBox
                  title={t('Malicious Application')}
                  text={t('This application is malicious, do not proceed.')}
                />
              )}
            {featureFlags[FeatureGates.BLOCKAID_DAPP_SCAN_WARNING] &&
              isMissingBlockaidData && (
                <WarningBox
                  title={t('Suspicious Application')}
                  text={t('Use caution, this application may be malicious.')}
                />
              )}
            <SiteAvatar sx={{ m: 0 }}>
              <TokenIcon
                height="48px"
                width="48px"
                src={action.displayData.domainIcon}
              >
                <GlobeIcon size={48} color={theme.palette.text.secondary} />
              </TokenIcon>
            </SiteAvatar>
            <Stack
              sx={{
                gap: 0.5,
                textAlign: 'center',
                maxWidth: 1,
              }}
            >
              <Typography variant="h5">
                {action.displayData.domainName}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  color: theme.palette.text.secondary,
                  wordWrap: 'break-word',
                }}
              >
                {action.displayData.domainUrl}
              </Typography>
            </Stack>
          </Stack>
          <AccountsDropdown
            allAccountsForRequestedVM={allAccountsForRequestedVM}
            activeAccount={activeAccount}
            onSelectedAccountChanged={(acc) => setSelectedAccount(acc)}
            addressVM={action.displayData.addressVM}
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
              gap: 1,
            }}
          >
            <Button
              color="secondary"
              data-testid="connect-reject-btn"
              onClick={() => {
                cancelHandler();
                window.close();
              }}
              fullWidth
              size="large"
              disabled={isSubmitting}
            >
              {t('Reject')}
            </Button>
            <Button
              data-testid="connect-approve-btn"
              onClick={() => onApproveClicked()}
              fullWidth
              size="large"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? '' : t('Approve')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {featureFlags[FeatureGates.BLOCKAID_DAPP_SCAN] && isMaliciousDApp && (
        <AlertDialog
          proceedLabel={t('Proceed Anyway')}
          cancelHandler={() => {
            cancelHandler();
            window.close();
          }}
          open={displayDialog}
          onClose={() => setDisplayDialog(false)}
          title={t('Scam Application')}
          text={t('This application is malicious, do not proceed.')}
          rejectLabel={t('Reject Connection')}
        />
      )}
    </>
  );
}
