import { Overlay, VerticalFlex } from '@avalabs/react-components';
import { LedgerApprovalDialog } from './LedgerApprovalDialog';
import { TransactionDisplayValues } from '@src/background/services/transactions/models';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';

interface LedgerApprovalOverlayProps {
  displayData: TransactionDisplayValues;
}

export function LedgerApprovalOverlay({
  displayData,
}: LedgerApprovalOverlayProps) {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();

  if (!isUsingLedgerWallet) {
    return null;
  }

  return (
    <Overlay>
      <VerticalFlex
        padding="40px 16px 16px"
        height={'100%'}
        width={'100%'}
        align={'center'}
        justify="center"
      >
        <LedgerApprovalDialog
          address={displayData.toAddress}
          fee={displayData.fee}
          feeSymbol={displayData.feeSymbol}
        />
      </VerticalFlex>
    </Overlay>
  );
}
