import { LoadingOverlay } from 'packages/ui/src/components/common/LoadingOverlay';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { KeystoneApprovalOverlay } from 'packages/ui/pages/SignTransaction/components/KeystoneApprovalOverlay';
import { LedgerApprovalDialog } from 'packages/ui/pages/SignTransaction/components/LedgerApprovalDialog';
import { Overlay } from 'packages/ui/src/components/common/Overlay';
import { WalletConnectApprovalOverlay } from 'packages/ui/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import useIsUsingFireblocksAccount from '@src/hooks/useIsUsingFireblocksAccount';
import { FireblocksApprovalOverlay } from 'packages/ui/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay';

interface TxInProgressProps {
  address?: string;
  fee?: string;
  feeSymbol?: string;
  amount?: string;
  symbol?: string;
  nftName?: string;
  requiredSignatures?: number;
  currentSignature?: number;
  onReject?: () => void;
  onSubmit?: () => Promise<unknown>;
}

export function TxInProgress({
  fee,
  feeSymbol,
  amount,
  symbol,
  address,
  nftName,
  requiredSignatures,
  currentSignature,
  onReject,
  onSubmit,
}: TxInProgressProps) {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const isUsingWalletConnectAccount = useIsUsingWalletConnectAccount();
  const isUsingFireblocksAccount = useIsUsingFireblocksAccount();
  const hasRejectCallback = typeof onReject === 'function';
  const hasSubmitCallback = typeof onSubmit === 'function';

  if (isUsingFireblocksAccount) {
    if (hasRejectCallback && hasSubmitCallback) {
      return (
        <FireblocksApprovalOverlay onReject={onReject} onSubmit={onSubmit} />
      );
    }

    throw new Error('Please provide proper onSubmit and onReject callbacks');
  }

  if (isUsingWalletConnectAccount) {
    if (hasRejectCallback && hasSubmitCallback) {
      return (
        <WalletConnectApprovalOverlay
          onReject={onReject}
          onSubmit={onSubmit}
          requiredSignatures={requiredSignatures}
          currentSignature={currentSignature}
        />
      );
    }

    throw new Error('Please provide proper onSubmit and onReject callbacks');
  }

  if (isUsingLedgerWallet) {
    return (
      <Overlay>
        <LedgerApprovalDialog
          address={address}
          fee={fee}
          feeSymbol={feeSymbol}
          amount={amount}
          symbol={symbol}
          nftName={nftName}
          currentSignature={currentSignature}
          requiredSignatures={requiredSignatures}
        />
      </Overlay>
    );
  }

  if (isUsingKeystoneWallet) {
    if (!hasRejectCallback) {
      throw new Error('Please provide a proper onReject callback');
    }

    return <KeystoneApprovalOverlay onReject={onReject} />;
  }

  return <LoadingOverlay />;
}
