import { Overlay } from '@avalabs/react-components';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { LedgerApprovalDialog } from '@src/contracts/contractParsers/LedgerApprovalDialog';

interface TxInProgressProps {
  address?: string;
  fee: string;
  amount?: string;
  symbol?: string;
}

export function TxInProgress({
  fee,
  amount,
  symbol,
  address,
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
        />
      </Overlay>
    );
  }

  return <LoadingOverlay />;
}
