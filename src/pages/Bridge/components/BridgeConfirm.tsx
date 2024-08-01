import { Blockchain } from '@avalabs/core-bridge-sdk';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { useEffect } from 'react';
import { getLedgerAppForBlockchain } from '../utils/getLedgerAppForBlockchain';

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
    getLedgerAppForBlockchain(blockchain)
  );

  useEffect(() => {
    if (hasCorrectApp && !isTransactionPending) {
      startTransfer();
    }
  }, [hasCorrectApp, startTransfer, isTransactionPending]);

  return null;
}
