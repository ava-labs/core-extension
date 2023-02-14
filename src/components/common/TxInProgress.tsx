import { Overlay } from '@avalabs/react-components';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { LedgerApprovalDialog } from '@src/pages/SignTransaction/LedgerApprovalDialog';

interface TxInProgressProps {
  address?: string;
  fee?: string;
  feeSymbol?: string;
  amount?: string;
  symbol?: string;
  nftName?: string;
}

export function TxInProgress({
  fee,
  feeSymbol,
  amount,
  symbol,
  address,
  nftName,
}: TxInProgressProps) {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();

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

  return <LoadingOverlay />;
}
