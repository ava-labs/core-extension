import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { KeystoneApprovalOverlay } from '@src/pages/SignTransaction/KeystoneApprovalOverlay';
import { LedgerApprovalDialog } from '@src/pages/SignTransaction/LedgerApprovalDialog';
import { Overlay } from '@src/components/common/Overlay';
import { WalletConnectApprovalOverlay } from '@src/pages/SignTransaction/WalletConnectApprovalOverlay';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import useIsUsingFireblocksAccount from '@src/hooks/useIsUsingFireblocksAccount';
import { FireblocksApprovalOverlay } from '@src/pages/SignTransaction/FireblocksApprovalOverlay';

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
