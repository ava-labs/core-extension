import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { KeystoneApprovalOverlay } from '@src/pages/SignTransaction/KeystoneApprovalOverlay';
import { LedgerApprovalDialog } from '@src/pages/SignTransaction/LedgerApprovalDialog';
import { Overlay } from '@src/components/common/Overlay';
interface TxInProgressProps {
  address?: string;
  fee?: string;
  feeSymbol?: string;
  amount?: string;
  symbol?: string;
  nftName?: string;
  onReject?: () => void;
}

export function TxInProgress({
  fee,
  feeSymbol,
  amount,
  symbol,
  address,
  nftName,
  onReject,
}: TxInProgressProps) {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();

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
    return <KeystoneApprovalOverlay onReject={onReject} />;
  }

  return <LoadingOverlay />;
}
