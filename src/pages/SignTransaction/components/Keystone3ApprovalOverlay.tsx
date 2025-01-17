import { Stack } from '@avalabs/core-k2-components';

import { Overlay } from '@src/components/common/Overlay';
import useIsUsingKeystone3Wallet from '@src/hooks/useIsUsingKeystone3Wallet';

import { KeystoneApprovalDialog } from './KeystoneApprovalDialog';

interface Keystone3ApprovalOverlayProps {
  to?: string;
  contractAddress?: string;
  fee?: string;
  feeSymbol?: string;
  amount?: string;
  symbol?: string;
}

export function Keystone3ApprovalOverlay({
  to,
  contractAddress,
  fee,
  feeSymbol,
  amount,
  symbol,
}: Keystone3ApprovalOverlayProps) {
  const isUsingKeystone3Wallet = useIsUsingKeystone3Wallet();

  if (!isUsingKeystone3Wallet) {
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
        <KeystoneApprovalDialog
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
