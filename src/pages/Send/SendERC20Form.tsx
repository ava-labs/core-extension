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
  Card,
  HorizontalSeparator,
} from '@avalabs/react-components';
import { SendErc20Confirm } from './SendErc20Confirm';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import debounce from 'lodash.debounce';
import { useErc20FormErrors, ERC20 } from '@avalabs/wallet-react-components';
import { GasPrice } from '@src/background/services/gas/models';

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
    sendFee,
    sendFeeDisplayValue,
  } = useSendErc20(token);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [amountInput, setAmountInput] = useState(new BN(0));
  const { addressError, amountError } = useErc20FormErrors(error);
  const [amountDisplayValue, setAmountDisplayValue] = useState('');

  function resetForm() {
    setAddressInput('');
    setAmountInput(undefined as any);
  }

  const setValuesDebounced = useMemo(
    () =>
      debounce((amount: string, address: string) => {
        if (amount && address) {
          setValues(amount, address);
        }
      }, 200),
    []
  );

  useEffect(() => {
    setValuesDebounced(amountDisplayValue, addressInput);
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
        onChange={(val) => {
          setAmountInput(val.bn);
          setAmountDisplayValue(val.amount);
        }}
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
      <Card>
        <VerticalFlex width={'100%'}>
          <HorizontalFlex
            width={'100%'}
            justify={'space-between'}
            align={'center'}
          >
            <Typography margin={'0 0 5px 0'}>Gas Price</Typography>
            <Typography>
              {(gasPrice as unknown as GasPrice)?.value || 0} nAVAX
            </Typography>
          </HorizontalFlex>
          <HorizontalSeparator margin={'10px 0'} />
          <HorizontalFlex
            width={'100%'}
            justify={'space-between'}
            align={'center'}
          >
            <Typography margin={'0 0 5px 0'}>Gas Limit</Typography>
            <Typography>{gasLimit || 0}</Typography>
          </HorizontalFlex>

          <HorizontalSeparator margin={'10px 0'} />

          <HorizontalFlex
            width={'100%'}
            justify={'space-between'}
            align={'center'}
          >
            <Typography>Fee</Typography>
            <Typography>{sendFeeDisplayValue || 0} AVAX</Typography>
          </HorizontalFlex>
        </VerticalFlex>
      </Card>
      <br />

      <br />
      <br />
      <br />
      <SendErc20Confirm
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        amount={amountDisplayValue}
        address={address as string}
        fee={`${sendFeeDisplayValue || 0}`}
        amountUsd={'0'}
        onConfirm={() =>
          submit(amountDisplayValue as string).then(() => resetForm())
        }
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
