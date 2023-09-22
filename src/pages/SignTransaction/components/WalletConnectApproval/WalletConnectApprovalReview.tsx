import {
  AlertTriangleIcon,
  Button,
  CheckCircleIcon,
  Divider,
  Stack,
  Typography,
  styled,
} from '@avalabs/k2-components';
import { Trans, useTranslation } from 'react-i18next';
import { WalletConnectCircledIcon } from '../../../ImportWithWalletConnect/components/WalletConnectCircledIcon';
import { WalletConnectSessionInfo } from '@src/background/services/walletConnect/models';
import { ImageWithFallback } from '@src/components/common/ImageWithFallback';
import { truncateAddress } from '@src/utils/truncateAddress';
import { Account } from '@src/background/services/accounts/models';

interface WalletConnectApprovalReviewProps {
  isValidSession: boolean;
  account?: Account;
  session?: WalletConnectSessionInfo | null;
  onReject?: () => void;
  onSign?: () => void;
}

const WalletImage = styled(ImageWithFallback)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
`;

export function WalletConnectApprovalReview({
  account,
  session,
  onReject,
  onSign,
  isValidSession,
}: WalletConnectApprovalReviewProps) {
  const { t } = useTranslation();

  return (
    <Stack sx={{ alignItems: 'center' }}>
      <WalletConnectCircledIcon width={64} height={64} />
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
              <WalletImage src={session?.walletApp?.icons[0]} />
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
          {isValidSession ? <ReadyToSign /> : <WrongNetwork />}
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
        <Button size="large" color="secondary" fullWidth onClick={onReject}>
          {t('Reject')}
        </Button>
        <Button
          size="large"
          fullWidth
          onClick={onSign}
          disabled={!isValidSession}
        >
          {t('Sign')}
        </Button>
      </Stack>
    </Stack>
  );
}

const ReadyToSign = () => (
  <Stack sx={{ columnGap: 1, flexDirection: 'row', alignItems: 'center' }}>
    <CheckCircleIcon sx={{ color: 'success.main' }} />
    <Typography variant="body1">
      <Trans i18nKey="Connected and ready to sign" />
    </Typography>
  </Stack>
);

const WrongNetwork = () => (
  <Stack sx={{ columnGap: 1, flexDirection: 'row', alignItems: 'start' }}>
    <AlertTriangleIcon sx={{ color: 'warning.main', pt: 0.5 }} />
    <Typography variant="body1">
      <Trans i18nKey="Wrong network. Please switch networks on your mobile device." />
    </Typography>
  </Stack>
);
