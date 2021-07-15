import { useBalance } from '@src/hooks/useBalance';
import { useStore } from '@src/store/store';
import { useEffect, useState } from 'react';
import { BN, AddressHelper, Utils } from '@avalabs/avalanche-wallet-sdk';
import { UniversalTx } from '@avalabs/avalanche-wallet-sdk/dist/helpers/universal_tx_helper';
import { ChainIdType } from '../../../../avalanche-wallet-sdk-internal/dist/types';

interface UniversalTxReceipt {
  export: string;
  import: string;
}

export function useSendAvax() {
  const { walletStore, networkStore } = useStore();
  const { balanceAvax } = useBalance(walletStore.wallet, networkStore.network);
  const [amount, setAmount] = useState<BN | undefined>();
  const [address, setAddress] = useState('');
  const wallet = walletStore.wallet;
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState('');
  const [txId, setTxId] = useState('');

  const [fee, setFee] = useState<BN>(new BN(0));

  const [targetChain, setTargetChain] = useState('C');

  const [txs, setTxs] = useState<UniversalTx[]>([]);
  const [activeTxIndex, setActiveTxIndex] = useState(0);

  useEffect(() => {
    try {
      let chain = AddressHelper.getAddressChain(address);
      if (chain === 'P') return;
      setTargetChain(chain);
    } catch (e) {}
  }, [address]);

  function formCheck() {
    if (!address || typeof amount === 'undefined' || amount.isZero()) {
      setError('');
      setCanSubmit(false);
      return false;
    }

    if (!AddressHelper.validateAddress(address)) {
      setCanSubmit(false);
      return false;
    }

    if (AddressHelper.getAddressChain(address) === 'P') {
      setCanSubmit(false);
      setError('Must be a valid X or C chain address.');
      return false;
    }

    // Check if we can have enough balance on the destination chain
    if (
      !walletStore.wallet?.canHaveBalanceOnChain(
        targetChain as ChainIdType,
        amount
      )
    ) {
      setError('Insufficient balance.');
      setCanSubmit(false);
      return false;
    }

    setCanSubmit(true);
    setError('');
    return true;
  }

  useEffect(() => {
    formCheck();
  }, [amount, address]);

  useEffect(() => {
    if (!canSubmit || !amount) {
      setTxs([]);
      return;
    }

    // Get the transactions needed to have the necessary balance on the destination chain
    try {
      // Add the required fee to amount
      let fee = Utils.getTxFeeX();
      // Fee structure is different on C chain
      // TODO: Update this when dynamic fees come
      if (targetChain === 'C') {
        fee = new BN(225).mul(new BN(21000));
      }

      let feeAmt = amount.add(fee);
      let txArray = wallet?.getTransactionsForBalance(
        targetChain as ChainIdType,
        feeAmt
      );
      txArray && setTxs(txArray);
    } catch (e) {
      console.log('Unable to complete transaction', e);
    }
  }, [canSubmit, targetChain, amount]);

  async function runTransaction(tx: UniversalTx): Promise<UniversalTxReceipt> {
    let exportTx;
    let importTx;

    if (!wallet) {
      throw new Error('wallet undefined');
    }

    switch (tx.action) {
      case 'export_x_c':
        exportTx = await wallet.exportXChain(tx.amount, 'C');
        importTx = await wallet.importC();
        break;
      case 'export_x_p':
        exportTx = await wallet.exportXChain(tx.amount, 'P');
        importTx = await wallet.importP();
        break;
      case 'export_c_x':
        exportTx = await wallet.exportCChain(tx.amount);
        importTx = await wallet.importX('C');
        break;
      case 'export_p_x':
        exportTx = await wallet.exportPChain(tx.amount);
        importTx = await wallet.importX('P');
        break;
      default:
        throw new Error('Method not supported.');
    }

    return {
      export: exportTx,
      import: importTx,
    };
  }

  function clearForm() {
    setTxId('');
    setAddress('');
    setAmount(undefined);
    setActiveTxIndex(0);
    setError('');
  }

  async function send() {
    // First do the initial transaction to get balance on the correct chain
    let priorTxIds: UniversalTxReceipt[] = [];
    for (var i = 0; i < txs.length; i++) {
      let tx = txs[0];
      setActiveTxIndex(activeTxIndex + 1);
      let exportImportId = await runTransaction(tx);
      priorTxIds.push(exportImportId);
    }

    if (!wallet) {
      throw new Error('wallet undefined');
    }
    // Send the actual transaction
    let finalTxId: string;
    switch (targetChain) {
      case 'X':
        finalTxId = await wallet.sendAvaxX(address!, amount!);
        setTxId(finalTxId);
        break;
      case 'C':
        let gasLimit = 21000;
        let gasPrice = Utils.numberToBN(225, 9);

        // Convert amount to decimals 18
        let amtC = Utils.avaxXtoC(amount!);
        finalTxId = await wallet.sendAvaxC(address!, amtC, gasPrice, gasLimit);
        setTxId(finalTxId);
        break;
    }
  }

  return {
    send,
    clearForm,
    targetChain,
    canSubmit,
    error,
    txId,
    txs,
    setAmount,
    setAddress,
    amount,
    address,
  };
}
