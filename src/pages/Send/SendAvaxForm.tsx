import {
  Typography,
  VerticalFlex,
  Input,
  PrimaryButton,
  BNInput,
  HorizontalFlex,
  SubTextTypography,
  SecondaryButton,
} from '@avalabs/react-components';
import React, { useMemo } from 'react';
import { useSendAvax } from './useSendAvax';
import { SendAvaxConfirm } from './SendAvaxConfirm';
import { useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { useEffect } from 'react';
import { useSendAvaxFormErrors } from '@avalabs/wallet-react-components';
import debounce from 'lodash.debounce';
import {
  getAvaxBalanceTotal,
  getAvaxBalanceUSD,
} from '../Wallet/utils/balanceHelpers';
import { useWalletContext } from '@src/contexts/WalletProvider';

export function SendAvaxForm() {
  const {
    targetChain,
    txId,
    setValues,
    error,
    canSubmit,
    amount,
    address,
    submit,
    reset,
    sendFee,
    txs,
  } = useSendAvax();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [amountInput, setAmountInput] = useState(new BN(0));
  const { amountError, addressError } = useSendAvaxFormErrors(error);
  const { avaxPrice } = useWalletContext();
  const [amountDisplayValue, setAmountDisplayValue] = useState('');

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
    <VerticalFlex width={'100%'}>
      <br />
      <VerticalFlex>
        <BNInput
          value={amountInput as any}
          label={'Amount'}
          error={amountError.error}
          errorMessage={amountError.message}
          placeholder="Enter the amount"
          denomination={9}
          onChange={(val) => {
            setAmountInput(val.bn);
            setAmountDisplayValue(val.amount);
          }}
        />
        {!amountError.error ? (
          <HorizontalFlex
            width={'100%'}
            justify={'space-between'}
            align={'center'}
            margin={'8px 0 0 0'}
          >
            <Typography size={14}>
              ${getAvaxBalanceUSD(amount || new BN(0), avaxPrice)}
            </Typography>
            {targetChain === 'X' ? (
              <SubTextTypography size={14}>
                Transaction fee: {getAvaxBalanceTotal(sendFee || new BN(0))}{' '}
                AVAX
              </SubTextTypography>
            ) : (
              ''
            )}
          </HorizontalFlex>
        ) : (
          ''
        )}
      </VerticalFlex>
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
      <br />
      <br />
      <SendAvaxConfirm
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        amount={amountDisplayValue as string}
        address={address as string}
        fee={
          targetChain === 'X' ? getAvaxBalanceTotal(sendFee || new BN(0)) : ''
        }
        extraTxs={txs as any}
        amountUsd={'0'}
        onConfirm={() => submit().then(() => resetForm())}
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
