import { useNetworkContext } from '@/contexts/NetworkProvider';
import { useEffect, useMemo, useState } from 'react';
import { useRequiredSession } from '@/components/common/walletConnect/useRequiredSession';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { CircularProgress, Stack } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { WalletConnectApprovalConnect } from '../WalletConnectApproval/WalletConnectApprovalConnect';
import { shouldUseWalletConnectApproval } from '@core/common';
import {
  ApprovalStep,
  getActiveStep,
} from '../../utils/getActiveStepForRemoteApproval';
import { RemoteApprovalDialog } from '../RemoteApproval/RemoteApprovalDialog';
import { FireblocksApprovalReview } from './FireblocksApprovalReview';
import { FireblocksAvatar } from '../../../Fireblocks/components/FireblocksAvatar';

interface FireblocksApprovalOverlayProps {
  onReject: () => void;
  onSubmit: () => void;
  address?: string;
  amount?: string;
  symbol?: string;
  fee?: string;
  feeSymbol?: string;
  nftName?: string;
}

export function FireblocksApprovalOverlay({
  onReject,
  onSubmit,
}: FireblocksApprovalOverlayProps) {
  const { t } = useTranslation();
  const { network: activeNetwork } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const [requestSent, setRequestSent] = useState(false);
  const {
    activeSession,
    isValidSession,
    isNewConnectionRequired,
    establishRequiredSession,
  } = useRequiredSession();

  const shouldUseWalletConnectToApprove = useMemo(() => {
    if (!activeNetwork || !activeAccount) {
      return undefined;
    }

    return shouldUseWalletConnectApproval(activeNetwork, activeAccount);
  }, [activeAccount, activeNetwork]);

  const activeStep = useMemo(() => {
    if (shouldUseWalletConnectToApprove === undefined) {
      return ApprovalStep.LOADING;
    }

    if (shouldUseWalletConnectToApprove) {
      return getActiveStep(requestSent, activeSession, isNewConnectionRequired);
    } else {
      if (requestSent) {
        return ApprovalStep.SENT;
      }
      return ApprovalStep.APPROVAL;
    }
  }, [
    requestSent,
    isNewConnectionRequired,
    activeSession,
    shouldUseWalletConnectToApprove,
  ]);

  const pageTitle = useMemo(() => {
    switch (activeStep) {
      case ApprovalStep.APPROVAL:
        return t('Fireblocks Approval');
      case ApprovalStep.CONNECT:
        return t('Scan QR Code to Connect');
      default:
        return '';
    }
  }, [activeStep, t]);

  useEffect(() => {
    if (activeAccount && activeNetwork) {
      establishRequiredSession(activeAccount.addressC, activeNetwork.chainId);
    }
  }, [activeAccount, activeNetwork, establishRequiredSession]);

  return (
    <RemoteApprovalDialog onReject={onReject} pageTitle={pageTitle}>
      {activeStep === ApprovalStep.LOADING && (
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            mt: 20,
          }}
        >
          <CircularProgress size={80} />
        </Stack>
      )}
      {(activeStep === ApprovalStep.APPROVAL ||
        activeStep === ApprovalStep.SENT) && (
        <FireblocksApprovalReview
          account={activeAccount}
          useWalletConnectApproval={
            shouldUseWalletConnectToApprove === undefined
              ? false
              : shouldUseWalletConnectToApprove
          }
          activeStep={activeStep}
          session={activeSession}
          isValidSession={isValidSession}
          onReject={onReject}
          onSign={() => {
            setRequestSent(true);
            onSubmit();
          }}
        />
      )}
      {activeStep === ApprovalStep.CONNECT && (
        <WalletConnectApprovalConnect
          appIcon={<FireblocksAvatar />}
          reconnectionAddress={activeAccount?.addressC as string}
          customMessage={t(
            'Please reconnect using Wallet Connect to add this network to authorized networks.',
          )}
          onConnect={() => {
            establishRequiredSession(
              activeAccount?.addressC as string,
              activeNetwork?.chainId as number,
            );
          }}
        />
      )}
    </RemoteApprovalDialog>
  );
}
