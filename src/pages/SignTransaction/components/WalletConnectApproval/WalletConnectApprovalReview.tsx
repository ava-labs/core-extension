import {
  AlertTriangleIcon,
  CheckCircleIcon,
  Stack,
  Typography,
  styled,
} from '@avalabs/k2-components';
import { Trans } from 'react-i18next';
import { WalletConnectCircledIcon } from '../../../ImportWithWalletConnect/components/WalletConnectCircledIcon';
import { WalletConnectSessionInfo } from '@src/background/services/walletConnect/models';
import { ImageWithFallback } from '@src/components/common/ImageWithFallback';
import { Account } from '@src/background/services/accounts/models';
import { RemoteApprovalConfirmation } from '../RemoteApproval/RemoteApprovalConfirmation';

interface WalletConnectApprovalReviewProps {
  isValidSession: boolean;
  onReject: () => void;
  onSign: () => void;
  account?: Account;
  session?: WalletConnectSessionInfo | null;
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
  return (
    <RemoteApprovalConfirmation
      logo={<WalletConnectCircledIcon />}
      status={isValidSession ? <ReadyToSign /> : <WrongNetwork />}
      isValidSession={isValidSession}
      connectingToIcon={<WalletImage src={session?.walletApp?.icons[0]} />}
      useRetryButton={false}
      useWalletConnectApproval={true}
      account={account}
      session={session}
      onReject={onReject}
      onSign={onSign}
    />
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
