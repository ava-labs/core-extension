import { Overlay } from '@avalabs/react-components';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { LedgerApprovalDialog } from '@src/pages/SignTransaction/LedgerApprovalDialog';

interface TxInProgressProps {
  address?: string;
  fee: string;
  amount?: string;
  symbol?: string;
  nftName?: string;
}

export function TxInProgress({
  fee,
  amount,
  symbol,
  address,
  nftName,
}: TxInProgressProps) {
  const { walletType } = useWalletContext();

  if (walletType === 'ledger') {
    return (
      <Overlay>
        <LedgerApprovalDialog
          address={address}
          fee={fee}
          amount={amount}
          symbol={symbol}
          nftName={nftName}
        />
      </Overlay>
    );
  }

  return <LoadingOverlay />;
}
