import React from 'react';
import { useSendErc20 } from './useSendErc20';
import {
  Typography,
  Input,
  BNInput,
  VerticalFlex,
  PrimaryButton,
  HorizontalFlex,
  SecondaryButton,
} from '@avalabs/react-components';
import { ERC20 } from './models';

export function SendERC20Form({ token }: { token: ERC20 }) {
  const {
    address,
    setAddress,
    amount,
    setAmount,
    gasPrice,
    gasLimit,
    txId,
    reset,
    submit,
    canSubmit,
    error,
    sendFeeDisplayValue,
  } = useSendErc20(token);

  return (
    <VerticalFlex>
      <br />
      <br />

      <VerticalFlex width={'100%'}>
        <Typography margin={'0 0 5px 0'}>Amount</Typography>
        <BNInput
          value={amount as any}
          denomination={token.denomination}
          onChange={setAmount}
        ></BNInput>
      </VerticalFlex>
      <br />

      <VerticalFlex width={'100%'}>
        <Typography margin={'0 0 5px 0'}>To</Typography>
        <Input
          value={address}
          onChange={(e) => setAddress(e.currentTarget.value)}
        ></Input>
      </VerticalFlex>
      <br />

      <HorizontalFlex width={'100%'} justify={'space-between'}>
        <VerticalFlex>
          <Typography margin={'0 0 5px 0'}>Gas Price</Typography>
          <Typography>{gasPrice} nAVAX</Typography>
        </VerticalFlex>
        <VerticalFlex>
          <Typography margin={'0 0 5px 0'}>Gas Limit</Typography>
          <Typography>{gasLimit}</Typography>
        </VerticalFlex>
      </HorizontalFlex>
      <br />

      <HorizontalFlex>
        <Typography>Fee</Typography>
        <Typography>{sendFeeDisplayValue} AVAX</Typography>
      </HorizontalFlex>
      <br />
      <br />
      <br />
      <VerticalFlex width={'100%'} align={'center'}>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
        <br />
        <PrimaryButton disabled={!canSubmit} onClick={submit}>
          Continue
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
