import { CircularProgress, Stack } from '@avalabs/core-k2-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useRequiredSession } from 'packages/ui/src/components/common/walletConnect/useRequiredSession';

import { WalletConnectApprovalReview } from './WalletConnectApprovalReview';
import { WalletConnectApprovalConnect } from './WalletConnectApprovalConnect';
import { WalletConnectApprovalSent } from './WalletConnectApprovalSent';
import { RemoteApprovalDialog } from '../RemoteApproval/RemoteApprovalDialog';
import {
  ApprovalStep,
  getActiveStep,
} from '../../utils/getActiveStepForRemoteApproval';

interface WalletConnectApprovalOverlayProps {
  onReject: () => void;
  onSubmit: () => Promise<unknown>;
  requiredSignatures?: number;
  currentSignature?: number;
}

export function WalletConnectApprovalOverlay({
  onReject,
  onSubmit,
  requiredSignatures = 1,
  currentSignature = 1,
}: WalletConnectApprovalOverlayProps) {
  const { t } = useTranslation();
  const { network: activeNetwork } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const {
    activeSession,
    isValidSession,
    isNewConnectionRequired,
    establishRequiredSession,
  } = useRequiredSession();
  const [requestSent, setRequestSent] = useState(false);

  const activeStep = useMemo(
    () => getActiveStep(requestSent, activeSession, isNewConnectionRequired),

    [requestSent, isNewConnectionRequired, activeSession],
  );

  const pageTitle = useMemo(() => {
    switch (activeStep) {
      case ApprovalStep.APPROVAL:
        return t('Wallet Connect Approval');
      case ApprovalStep.CONNECT:
        return t('Scan QR Code to Connect');
      default:
        return '';
    }
  }, [activeStep, t]);

  function submitHandler() {
    setRequestSent(true);
    onSubmit();
  }

  useEffect(() => {
    if (activeAccount && activeNetwork) {
      establishRequiredSession(activeAccount.addressC, activeNetwork.chainId);
    }
  }, [activeAccount, activeNetwork, establishRequiredSession]);

  return (
    <RemoteApprovalDialog onReject={onReject} pageTitle={pageTitle}>
      {
        {
          [ApprovalStep.LOADING]: (
            <Stack
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                mt: 20,
              }}
            >
              <CircularProgress size={80} />
            </Stack>
          ),
          [ApprovalStep.APPROVAL]: (
            <WalletConnectApprovalReview
              account={activeAccount}
              session={activeSession}
              isValidSession={isValidSession}
              onReject={onReject}
              onSign={submitHandler}
            />
          ),
          [ApprovalStep.CONNECT]: (
            <WalletConnectApprovalConnect
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
          ),
          [ApprovalStep.SENT]: (
            <WalletConnectApprovalSent
              onResend={submitHandler}
              requiredSignatures={requiredSignatures}
              currentSignature={currentSignature}
            />
          ),
        }[activeStep]
      }
    </RemoteApprovalDialog>
  );
}
