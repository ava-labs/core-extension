import { Blockchain } from '@avalabs/bridge-sdk';
import { NetworkVMType } from '@avalabs/chains-sdk';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { useEffect } from 'react';

interface BridgeConfirmLedgerProps {
  blockchain: Blockchain;
  isTransactionPending: boolean;
  onCancel: () => void;
  startTransfer: () => void;
}

export function BridgeConfirmLedger({
  onCancel,
  startTransfer,
  isTransactionPending,
  blockchain,
}: BridgeConfirmLedgerProps) {
  const hasCorrectApp = useLedgerDisconnectedDialog(
    onCancel,
    blockchain === Blockchain.BITCOIN
      ? NetworkVMType.BITCOIN
      : NetworkVMType.EVM
  );

  useEffect(() => {
    if (hasCorrectApp && !isTransactionPending) {
      startTransfer();
    }
  }, [hasCorrectApp, startTransfer, isTransactionPending]);

  return null;
}
