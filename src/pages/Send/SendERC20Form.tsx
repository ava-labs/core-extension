import React from 'react';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useSendErc20Form } from './useSendErc20Form';
import {
  Typography,
  Input,
  BNInput,
  VerticalFlex,
} from '@avalabs/react-components';
import { ERC20 } from './models';

export function SendERC20Form({ token }: { token: ERC20 }) {
  // const { wallet, tokens } = useWalletContext();
  // const {
  //   address,
  //   setAddress,
  //   amount,
  //   setAmount,
  //   gasPrice,
  //   gasLimit,
  //   txId,
  //   clear,
  //   send,
  //   canSubmit,
  //   error,
  //   getFeeText,
  // } = useSendErc20Form(token, tokens, wallet);

  return (
    <VerticalFlex>
      {/* <Typography>To</Typography>
      <Input
        value={address}
        onChange={(e) => setAddress(e.currentTarget.value)}
      ></Input>
      <Typography>Amount</Typography>
      <BNInput
        value={amount}
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
        <Typography>{getFeeText()} AVAX</Typography>
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
          <button onClick={clear}>Clear</button>
        </div>
      )}
      {!txId && (
        <button onClick={send} disabled={!canSubmit}>
          Confirm
        </button>
      )} */}
    </VerticalFlex>
  );
}
