import {
  Typography,
  VerticalFlex,
  Input,
  PrimaryButton,
  BNInput,
} from '@avalabs/react-components';
import React from 'react';
import { useSendAvax } from './useSendAvax';
import { SendTransactionsList } from './SendTransactionsList';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { getAvaxBalanceUSD } from '../Wallet/utils/balanceHelpers';

export function SendAvaxForm() {
  const { balances, avaxPrice } = useWalletContext();
  const {
    targetChain,
    txId,
    error,
    canSubmit,
    setAmount,
    setAddress,
    amount,
    address,
    submit,
    reset,
    txs,
  } = useSendAvax();

  return (
    <VerticalFlex>
      <VerticalFlex>
        <Typography>
          {balances.balanceAvaxTotal.toLocaleString()} AVAX
        </Typography>
        <Typography>
          ${getAvaxBalanceUSD(balances.balanceAvaxTotal, avaxPrice)} USD
        </Typography>
      </VerticalFlex>
      <Typography>To</Typography>
      <Input
        value={address}
        onChange={(e) => setAddress(e.currentTarget.value)}
      />
      <Typography>Amount</Typography>
      <BNInput
        value={amount as any}
        denomination={9}
        onChange={(bigAmount) => setAmount(bigAmount)}
      />
      <Typography>{targetChain}</Typography>
      {!txId ? (
        <>
          <Typography>{error}</Typography>

          <PrimaryButton onClick={submit} disabled={!canSubmit}>
            Confirm
          </PrimaryButton>
        </>
      ) : (
        <PrimaryButton onClick={reset}>Start Again</PrimaryButton>
      )}

      {txs && txs.length ? (
        <VerticalFlex>
          <Typography>
            Additional transactions needed to complete this send transaction.
            The wallet will do these transaction before sending the final
            amount.
          </Typography>

          <SendTransactionsList txs={txs} />
        </VerticalFlex>
      ) : (
        ''
      )}
    </VerticalFlex>
  );
}
