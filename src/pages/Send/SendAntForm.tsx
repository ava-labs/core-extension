import React, { useEffect, useMemo, useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
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
import { AntWithBalance } from '@src/hooks/useTokensWithBalances';
import debounce from 'lodash.debounce';
import { useSendAntFormErrors } from '@avalabs/wallet-react-components';

export function SendAntForm({ token }: { token: AntWithBalance }) {
  const { submit, canSubmit, address, amount, setValues, error, reset, txId } =
    useSendAnt(token);
  const [addressInput, setAddressInput] = useState('');
  const [amountInput, setAmountInput] = useState(new BN(0));
  const [amountDisplayValue, setAmountDisplayValue] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { amountError, addressError } = useSendAntFormErrors(error);

  function resetForm() {
    setAddressInput('');
    setAmountInput(undefined as any);
  }

  const setValuesDebounced = useMemo(
    () =>
      debounce((amount: BN, address: string) => {
        if (amount && !amount.isZero() && address) {
          setValues(amountDisplayValue, address);
        }
      }, 200),
    []
  );

  useEffect(() => {
    setValuesDebounced(amountInput, addressInput);
  }, [amountInput, addressInput]);

  return (
    <VerticalFlex>
      <BNInput
        label={'Amount'}
        error={amountError.error}
        errorMessage={amountError.message}
        denomination={token.denomination}
        onChange={(val) => {
          setAmountDisplayValue(val.amount);
          setAmountInput(val.bn);
        }}
        value={amount as any}
      />

      <Input
        label={'To'}
        value={address}
        error={addressError.error}
        errorMessage={addressError.message}
        onChange={(e) => setAddressInput(e.currentTarget.value)}
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
