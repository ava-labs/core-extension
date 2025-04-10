import {
  AlertTriangleIcon,
  CheckCircleIcon,
  CircularProgress,
  FireblocksIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { Trans } from 'react-i18next';
import { WalletConnectSessionInfo } from 'packages/service-worker/src/services/walletConnect/models';
import { Account } from 'packages/service-worker/src/services/accounts/models';
import { useMemo } from 'react';
import { ApprovalStep } from '../../utils/getActiveStepForRemoteApproval';
import { RemoteApprovalConfirmation } from '../RemoteApproval/RemoteApprovalConfirmation';
import { FireblocksAvatar } from '@src/pages/Fireblocks/components/FireblocksAvatar';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { isBitcoinNetwork } from 'packages/service-worker/src/services/network/utils/isBitcoinNetwork';
import isFireblocksApiSupported from 'packages/service-worker/src/services/fireblocks/utils/isFireblocksApiSupported';
import { isFireblocksAccount } from 'packages/service-worker/src/services/accounts/utils/typeGuards';

interface FireblocksApprovalReviewProps {
  isValidSession: boolean;
  activeStep: ApprovalStep;
  useWalletConnectApproval: boolean;
  onReject: () => void;
  onSign: () => void;
  account?: Account;
  session?: WalletConnectSessionInfo | null;
}

export function FireblocksApprovalReview({
  account,
  activeStep,
  useWalletConnectApproval,
  onReject,
  onSign,
  session,

  isValidSession,
}: FireblocksApprovalReviewProps) {
  const { network: activeNetwork } = useNetworkContext();

  const status = useMemo(() => {
    if (activeStep === ApprovalStep.SENT) {
      return <RequestPending />;
    }
    if (useWalletConnectApproval) {
      return isValidSession ? <ReadyToSign /> : <WrongNetwork />;
    }
    return <ReadyToSign />;
  }, [activeStep, isValidSession, useWalletConnectApproval]);

  const isSessionValid = useMemo(() => {
    if (useWalletConnectApproval) {
      return isValidSession;
    }

    return isFireblocksAccount(account) && isFireblocksApiSupported(account);
  }, [account, isValidSession, useWalletConnectApproval]);

  const isBtcNetwork = useMemo(
    () => (activeNetwork ? isBitcoinNetwork(activeNetwork) : false),
    [activeNetwork],
  );

  return (
    <RemoteApprovalConfirmation
      logo={
        <FireblocksAvatar
          badgeIcon={isBtcNetwork ? 'bitcoin' : 'walletConnect'}
        />
      }
      status={status}
      isValidSession={isSessionValid}
      connectingToIcon={<FireblocksIcon />}
      useRetryButton={true}
      useWalletConnectApproval={useWalletConnectApproval}
      account={account}
      session={session}
      onReject={onReject}
      onSign={onSign}
    />
  );
}

const RequestPending = () => (
  <Stack
    sx={{
      columnGap: 1,
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <CircularProgress size={16} />
    <Typography variant="body1">
      <Trans i18nKey="Signing request sent" />
    </Typography>
  </Stack>
);

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
