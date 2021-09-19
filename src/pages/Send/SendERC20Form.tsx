import React, { useEffect, useMemo, useState } from 'react';
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
import debounce from 'lodash.debounce';
import { useErc20FormErrors } from '@avalabs/wallet-react-components';

export function SendERC20Form({ token }: { token: ERC20 }) {
  const {
    address,
    setValues,
    amount,
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
  const [addressInput, setAddressInput] = useState('');
  const [amountInput, setAmountInput] = useState(new BN(0));
  const { addressError, amountError } = useErc20FormErrors(error);
  console.log(addressError, amountError);
  function resetForm() {
    setAddressInput('');
    setAmountInput(undefined as any);
  }

  const setValuesDebounced = useMemo(
    () =>
      debounce((amount: BN, address: string) => {
        if (amount && !amount.isZero() && address) {
          setValues(amount, address);
        }
      }, 200),
    []
  );

  useEffect(() => {
    setValuesDebounced(amountInput, addressInput);
  }, [amountInput, addressInput]);

  return (
    <VerticalFlex>
      <br />
      <br />
      <BNInput
        value={amountInput as any}
        label={'Amount'}
        error={amountError.error}
        errorMessage={amountError.message}
        placeholder="Enter the amount"
        denomination={token.denomination}
        onChange={setAmountInput}
      />
      <br />

      <Input
        label={'To'}
        value={addressInput as any}
        error={addressError.error}
        errorMessage={addressError.message}
        placeholder="Enter the address"
        onChange={(e) =>
          setAddressInput((e.nativeEvent.target as HTMLInputElement).value)
        }
      />
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
        <SecondaryButton
          onClick={() => {
            reset().then(() => resetForm());
          }}
        >
          Reset
        </SecondaryButton>
        <br />
        <PrimaryButton
          onClick={() => setShowConfirmation(true)}
          disabled={!canSubmit}
        >
          Continue
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
