import React from 'react';
import { AssetBalanceX } from '@avalabs/avalanche-wallet-sdk';
import { useSendAnt } from './useSendAnt';
import {
  Typography,
  Input,
  BNInput,
  VerticalFlex,
  HorizontalFlex,
  PrimaryButton,
  SecondaryButton,
} from '@avalabs/react-components';

export function SendAntForm({ token }: { token: AssetBalanceX }) {
  const {
    submit,
    canSubmit,
    setAddress,
    address,
    amount,
    setAmount,
    error,
    reset,
    txId,
  } = useSendAnt(token);

  return (
    <VerticalFlex>
      <Typography>To</Typography>
      <Input
        value={address}
        onChange={(e) => setAddress(e.currentTarget.value)}
      />
      <Typography>Amount</Typography>
      <BNInput
        denomination={token.meta.denomination}
        onChange={(bnAmount) => setAmount(bnAmount.bn.toNumber())}
        value={amount as any}
      ></BNInput>
      <HorizontalFlex>
        <Typography>{error}</Typography>
      </HorizontalFlex>
      {txId && (
        <VerticalFlex>
          <Typography>Tx ID</Typography>
          <Typography>{txId}</Typography>
          <SecondaryButton onClick={reset}>Start Again</SecondaryButton>
        </VerticalFlex>
      )}
      {!txId && !error && (
        <PrimaryButton onClick={submit} disabled={!canSubmit}>
          Confirm
        </PrimaryButton>
      )}
    </VerticalFlex>
  );
}
