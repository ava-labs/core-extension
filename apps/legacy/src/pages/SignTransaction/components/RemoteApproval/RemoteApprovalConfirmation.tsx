import {
  Divider,
  Typography,
  Button,
  Stack,
} from '@avalabs/core-k2-components';
import { truncateAddress } from '@avalabs/core-utils-sdk';
import { Account, WalletConnectSessionInfo } from '@core/types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AdditionalConfirmationForRemoteApprovalProps {
  logo: JSX.Element;
  status: JSX.Element;
  isValidSession: boolean;
  connectingToIcon: JSX.Element;
  useRetryButton: boolean;
  useWalletConnectApproval: boolean;
  onReject: () => void;
  onSign: () => void;
  account?: Account;
  session?: WalletConnectSessionInfo | null;
}

export function RemoteApprovalConfirmation({
  logo,
  status,
  isValidSession,
  connectingToIcon,
  useRetryButton,
  useWalletConnectApproval,
  onReject,
  onSign,
  account,
  session,
}: AdditionalConfirmationForRemoteApprovalProps) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [enableSubmitButton, setEnableSubmitButton] = useState(true);

  const showRetryButton = useMemo(() => {
    if (!useRetryButton) {
      return false;
    }
    if (submitted) {
      return true;
    }
    return false;
  }, [submitted, useRetryButton]);

  return (
    <Stack sx={{ alignItems: 'center' }}>
      {logo}
      <Stack divider={<Divider />} sx={{ rowGap: 2, width: '100%', px: 3 }}>
        {account && (
          <Stack sx={{ rowGap: 0.5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Wallet')}
            </Typography>
            <Typography variant="body1">{account.name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {truncateAddress(account.addressC)}
            </Typography>
          </Stack>
        )}
        {session && (
          <Stack sx={{ rowGap: 0.5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('Connecting to')}
            </Typography>
            <Stack
              sx={{
                flexDirection: 'row',
                columnGap: 1,
                alignItems: 'center',
              }}
            >
              {connectingToIcon}
              <Typography variant="body1">
                {session?.walletApp?.name}
              </Typography>
            </Stack>
          </Stack>
        )}

        <Stack sx={{ rowGap: 0.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('Status')}
          </Typography>
          {status}
        </Stack>
      </Stack>
      <Stack
        sx={{
          alignItems: 'flex-end',
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100%',
          columnGap: 1,
          mt: 10,
          pb: 3,
          px: 3,
        }}
      >
        <Button
          size="large"
          color="secondary"
          fullWidth
          onClick={() => {
            setSubmitted(false);
            onReject();
          }}
          disabled={submitted}
        >
          {t('Reject')}
        </Button>
        <Button
          size="large"
          fullWidth
          onClick={() => {
            setSubmitted(true);
            setEnableSubmitButton(false);
            if (useWalletConnectApproval) {
              setTimeout(() => setEnableSubmitButton(true), 5000);
            }
            onSign();
          }}
          disabled={!isValidSession || !enableSubmitButton}
        >
          {showRetryButton && submitted ? t('Retry') : t('Sign')}
        </Button>
      </Stack>
    </Stack>
  );
}
