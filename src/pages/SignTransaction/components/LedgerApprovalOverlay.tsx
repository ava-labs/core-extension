import { Stack } from '@avalabs/core-k2-components';

import { Overlay } from '@src/components/common/Overlay';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';

import { LedgerApprovalDialog } from './LedgerApprovalDialog';

interface LedgerApprovalOverlayProps {
  to?: string;
  contractAddress?: string;
  fee?: string;
  feeSymbol?: string;
  amount?: string;
  symbol?: string;
}

export function LedgerApprovalOverlay({
  to,
  contractAddress,
  fee,
  feeSymbol,
  amount,
  symbol,
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
          address={contractAddress || to}
          fee={fee}
          feeSymbol={feeSymbol}
          amount={amount}
          symbol={symbol}
        />
      </Stack>
    </Overlay>
  );
}
