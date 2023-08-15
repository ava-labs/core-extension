import { Stack } from '@avalabs/k2-components';

import { Overlay } from '@src/components/common/Overlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { TransactionDisplayValues } from '@src/background/services/transactions/models';

import { LedgerApprovalDialog } from './LedgerApprovalDialog';

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
    <Overlay isBackgroundFilled>
      <Stack
        sx={{
          width: 1,
          height: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LedgerApprovalDialog
          address={displayData.toAddress}
          fee={displayData.fee}
          feeSymbol={displayData.feeSymbol}
          amount={displayData.amount}
          symbol={displayData.symbol}
        />
      </Stack>
    </Overlay>
  );
}
