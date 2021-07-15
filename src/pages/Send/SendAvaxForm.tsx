import {
  Typography,
  VerticalFlex,
  Input,
  PrimaryButton,
  BNInput,
} from '@avalabs/react-components';
import React from 'react';
import { useSendAvax } from './useSendAvax';
import { observer } from 'mobx-react-lite';
import { useWalletContext } from '@src/contexts/WalletProvider';

function Component() {
  const { balances, prices } = useWalletContext();
  const {
    send,
    targetChain,
    txId,
    error,
    canSubmit,
    clearForm,
    txs,
    setAmount,
    setAddress,
  } = useSendAvax();

  return (
    <VerticalFlex>
      <VerticalFlex>
        <Typography>
          {balances.balanceAvaxTotal.toLocaleString()} AVAX
        </Typography>
        <Typography>
          ${balances.getAvaxBalanceUSD(prices.avaxUSD).toLocaleString(2)} USD
        </Typography>
      </VerticalFlex>
      <Typography>To</Typography>
      <Input onChange={(e) => setAddress(e.currentTarget.value)} />
      <Typography>Amount</Typography>
      <BNInput
        denomination={9}
        onChange={(bigAmount) => setAmount(bigAmount)}
      />
      <Typography>{targetChain}</Typography>
      {!txId && (
        <>
          <Typography>{error}</Typography>

          <PrimaryButton onClick={send} disabled={!canSubmit}>
            Confirm
          </PrimaryButton>
        </>
      )}
      {txId && <PrimaryButton onClick={clearForm}>Start Again</PrimaryButton>}

      {txs.length > 0 && (
        <VerticalFlex>
          <Typography>
            Additional transactions needed to complete this send transaction.
            The wallet will do these transaction before sending the final
            amount.
          </Typography>

          {/* <TransactionsList txs={txs}></TransactionsList> */}
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
}

export const SendAvaxForm = observer(Component);