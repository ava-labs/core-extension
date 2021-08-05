import { useEffect, useState } from 'react';
import { AddressHelper, BN, Utils } from '@avalabs/avalanche-wallet-sdk';
import { AssetBalanceX, WalletType } from '@avalabs/avalanche-wallet-sdk';
import { UniversalTx } from '@avalabs/avalanche-wallet-sdk/dist/helpers/universal_tx_helper';

export function useSendAnt(wallet: WalletType, token: AssetBalanceX) {
  const [amount, setAmount] = useState<BN | undefined>();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  // Might need to move AVAX
  const [extraTxs, setExtraTxs] = useState<UniversalTx[]>([]);
  const [sendFee, setSendFee] = useState(Utils.getTxFeeX());
  const [extraFees, setExtraFees] = useState(Utils.getTxFeeX());

  const [txId, setTxId] = useState('');

  // Calculate internal transactions, move AVAX between chains
  useEffect(() => {
    let txs = wallet.getTransactionsForBalance('X', sendFee);
    setExtraTxs(txs);
  }, [sendFee]);

  useEffect(() => {
    let fee = extraTxs.map((tx) => Utils.getTxFeeX());
  }, [extraTxs]);

  function formCheck() {
    if (typeof amount === 'undefined' || !address) {
      setCanSubmit(false);
      setError('');
      return;
    }

    // Check if valid address
    if (!AddressHelper.validateAddress(address)) {
      setError('Invalid address.');
      setCanSubmit(false);
      return;
    }

    // Check if correct chain
    if (AddressHelper.getAddressChain(address) !== 'X') {
      setError('Address belongs to the wrong chain.');
      setCanSubmit(false);
      return;
    }

    // Not enough AVAX
    if (!wallet.canHaveBalanceOnChain('X', sendFee)) {
      setError('Insufficient AVAX balance to cover the fees.');
      setCanSubmit(false);
      return;
    }

    // Is balance greater than 0
    if (amount.isZero()) {
      setError('Amount must be greater than 0.');
      setCanSubmit(false);
      return;
    }

    if (amount.gt(token.unlocked)) {
      setError('Insufficient balance for this transaction.');
      setCanSubmit(false);
      return;
    }

    setError('');
    setCanSubmit(true);
  }

  useEffect(() => {
    formCheck();
  }, [amount, address]);

  async function submit() {
    let txID = await wallet.sendANT(token.meta.assetID, amount!, address);
    setTxId(txID);
  }

  function reset() {
    setAddress('');
    setAmount(undefined);
    setCanSubmit(false);
    setTxId('');
  }

  return {
    amount,
    address,
    submit,
    reset,
    error,
    canSubmit,
    sendFee,
    txId,
    setAddress,
    setAmount,
    extraTxs,
  };
}
