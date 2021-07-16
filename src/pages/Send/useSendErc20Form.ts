import { useEffect, useState } from 'react';
import { AddressHelper, BN, Utils } from '@avalabs/avalanche-wallet-sdk';
import { WalletType } from '@avalabs/avalanche-wallet-sdk/dist/Wallet/types';
import { ERC20 } from '@src/store/wallet/types';

export function useSendErc20Form(
  token: ERC20,
  erc20Balances?: ERC20[],
  wallet?: WalletType
) {
  const [amount, setAmount] = useState<BN | undefined>();
  const [address, setAddress] = useState('');

  const [gasLimit, setGasLimit] = useState(21000);
  const [gasPrice, setGasPrice] = useState(225);

  const [fee, setFee] = useState(gasLimit * gasPrice);

  const [error, setError] = useState<string>();
  const [canSubmit, setCanSubmit] = useState(false);

  const [txId, setTxId] = useState<string | undefined>(undefined);

  const [balance, setBalance] = useState<BN>(new BN(0));

  useEffect(() => {
    if (!erc20Balances) return;

    let bal = erc20Balances[token.address] || new BN(0);
    setBalance(bal);
  }, [erc20Balances, token]);

  // Update total fee when gas values change
  useEffect(() => {
    setFee(gasLimit * gasPrice);
  }, [gasLimit, gasPrice]);

  useEffect(() => {
    if (formCheck()) {
      updateGasLimit();
    }
  }, [amount, address]);

  function getFeeText() {
    let bn = Utils.numberToBN(fee, 9);
    return Utils.bnToAvaxC(bn);
  }

  function formCheck() {
    if (!address || typeof amount === 'undefined' || amount.isZero()) {
      setError('');
      setCanSubmit(false);
      return false;
    }

    if (!AddressHelper.validateAddress(address)) {
      setError('Invalid destination address.');
      setCanSubmit(false);
      return false;
    }

    if (AddressHelper.getAddressChain(address) !== 'C') {
      setError('Must be a C chain address.');
      setCanSubmit(false);
      return false;
    }

    if (amount.gt(balance)) {
      setError('Not enough balance.');
      setCanSubmit(false);
      return false;
    }

    setError('');
    setCanSubmit(true);
    return true;
  }

  let gasLimitTimeout;
  function updateGasLimit() {
    if (!amount) return;

    if (gasLimitTimeout) {
      clearTimeout(gasLimitTimeout);
    }

    // Timeout because called on every key store
    // Only update after 1000ms of inactivity

    gasLimitTimeout = setTimeout(async () => {
      let newGasLimit = await wallet!.estimateErc20Gas(
        token.address,
        address,
        amount
      );
      // TODO: Use 120% of suggested gas

      setGasLimit(newGasLimit);
    }, 200);
  }

  async function send() {
    if (!wallet) {
      return;
    }

    let to = address;

    if (!amount) return;

    let gasPriceBN = Utils.numberToBN(gasPrice, 9);
    let tx = await wallet.sendErc20(
      to,
      amount,
      gasPriceBN,
      gasLimit,
      token.address
    );
    setTxId(tx);
  }

  function clear() {
    setAddress('');
    setAmount(undefined);
    setTxId(undefined);
    setGasLimit(21000);
    setGasLimit(225);
    setCanSubmit(false);
    setError('');
  }

  return {
    amount,
    address,
    gasLimit,
    gasPrice,
    fee,
    error,
    canSubmit,
    txId,
    setAmount,
    setAddress,
    clear,
    send,
    getFeeText,
  };
}
