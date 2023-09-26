import {
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  Typography,
  XIcon,
} from '@avalabs/k2-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useRequiredSession } from '@src/components/common/walletConnect/useRequiredSession';

import { WalletConnectApprovalReview } from './components/WalletConnectApproval/WalletConnectApprovalReview';
import { WalletConnectApprovalConnect } from './components/WalletConnectApproval/WalletConnectApprovalConnect';
import { WalletConnectApprovalSent } from './components/WalletConnectApproval/WalletConnectApprovalSent';

export enum ApprovalStep {
  APPROVAL,
  CONNECT,
  SENT,
  LOADING,
}

interface WalletConnectApprovalOverlayProps {
  onReject: () => void;
  onSubmit: () => void;
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

  const activeStep = useMemo(() => {
    if (requestSent) {
      return ApprovalStep.SENT;
    }
    if (activeSession && !isNewConnectionRequired) {
      return ApprovalStep.APPROVAL;
    }
    if (isNewConnectionRequired) {
      return ApprovalStep.CONNECT;
    }
    return ApprovalStep.LOADING;
  }, [requestSent, isNewConnectionRequired, activeSession]);

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

  function signHandler() {
    setRequestSent(true);
    onSubmit();
  }

  useEffect(() => {
    if (activeAccount && activeNetwork) {
      establishRequiredSession(activeAccount.addressC, activeNetwork.chainId);
    }
  }, [activeAccount, activeNetwork, establishRequiredSession]);

  return (
    <Dialog
      open
      showCloseIcon={false}
      PaperProps={{
        sx: {
          m: 2,
          width: 1,
          height: 1,
          maxWidth: 'none',
          position: 'relative',
        },
      }}
    >
      <IconButton
        onClick={onReject}
        sx={{ position: 'absolute', top: 8, right: 8, p: 1 }}
        disableRipple
      >
        <XIcon size={24} />
      </IconButton>
      <Typography variant="h4" sx={{ py: 3, pl: 3, pr: 6 }}>
        {pageTitle}
      </Typography>
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
              onSign={signHandler}
            />
          ),
          [ApprovalStep.CONNECT]: (
            <WalletConnectApprovalConnect
              reconnectionAddress={activeAccount?.addressC as string}
              customMessage={t(
                'Please reconnect using Wallet Connect to add this network to authorized networks.'
              )}
              onConnect={() => {
                establishRequiredSession(
                  activeAccount?.addressC as string,
                  activeNetwork?.chainId as number
                );
              }}
            />
          ),
          [ApprovalStep.SENT]: (
            <WalletConnectApprovalSent
              onResend={signHandler}
              requiredSignatures={requiredSignatures}
              currentSignature={currentSignature}
            />
          ),
        }[activeStep]
      }
    </Dialog>
  );
}
