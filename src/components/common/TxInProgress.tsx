import { Overlay } from '@avalabs/react-components';
import { WalletType } from '@src/background/services/wallet/models';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { LedgerApprovalDialog } from '@src/pages/SignTransaction/LedgerApprovalDialog';

interface TxInProgressProps {
  address?: string;
  fee: string;
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
  const { walletType } = useWalletContext();

  if (walletType === WalletType.LEDGER) {
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
