import { LoadingIcon } from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import React from 'react';
import { AssetBalanceX } from '../../../../avalanche-wallet-sdk-internal/dist/Wallet/types';
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
  const { wallet } = useWalletContext();

  if (!wallet) {
    return <LoadingIcon />;
  }

  const {
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
  } = useSendAnt(wallet, token);
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
        onChange={(bnAmount) => setAmount(bnAmount)}
        value={amount}
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
