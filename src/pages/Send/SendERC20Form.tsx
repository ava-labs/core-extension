import React, { useState } from 'react';
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
import { SendErc20Confirm } from './SendErc20Confirm';
import { BN } from '@avalabs/avalanche-wallet-sdk';

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
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      <SendErc20Confirm
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        amount={amount as BN}
        address={address as string}
        fee={10}
        amountUsd={'0'}
        onConfirm={submit}
        token={token}
      />
      <VerticalFlex width={'100%'} align={'center'}>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
        <br />
        <PrimaryButton onClick={() => setShowConfirmation(true)}>
          Continue
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
