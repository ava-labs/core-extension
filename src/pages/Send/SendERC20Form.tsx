import React from 'react';
import { useSendErc20 } from './useSendErc20';
import {
  Typography,
  Input,
  BNInput,
  VerticalFlex,
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
      <Typography>To</Typography>
      <Input
        value={address}
        onChange={(e) => setAddress(e.currentTarget.value)}
      ></Input>
      <Typography>Amount</Typography>
      <BNInput
        value={amount as any}
        denomination={token.denomination}
        onChange={setAmount}
      ></BNInput>
      <Typography>Gas Price</Typography>
      <p>
        <Typography>{gasPrice} nAVAX</Typography>
      </p>
      <Typography>Gas Limit</Typography>
      <p>
        <Typography>{gasLimit}</Typography>
      </p>
      <Typography>Fee</Typography>
      <p>
        <Typography>{sendFeeDisplayValue} AVAX</Typography>
      </p>
      <p>
        <Typography>{error}</Typography>
      </p>

      {txId && (
        <div>
          <h2>
            <Typography>Success</Typography>
          </h2>
          <p>
            <Typography>Transaction Id</Typography>
          </p>
          <p>
            <Typography> {txId}</Typography>
          </p>
          <button onClick={reset}>Clear</button>
        </div>
      )}
      {!txId && (
        <button onClick={submit} disabled={!canSubmit}>
          Confirm
        </button>
      )}
    </VerticalFlex>
  );
}
