import React, { useEffect, useMemo, useState } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { useSendAnt } from './useSendAnt';
import {
  Input,
  BNInput,
  VerticalFlex,
  PrimaryButton,
  SecondaryButton,
} from '@avalabs/react-components';
import { AntWithBalance } from '@avalabs/wallet-react-components';
import debounce from 'lodash.debounce';
import { useSendAntFormErrors } from '@avalabs/wallet-react-components';
import { SendAntConfirm } from './sendAntConfirm';

export function SendAntForm({ token }: { token: AntWithBalance }) {
  const { submit, canSubmit, address, setValues, error, reset, txId } =
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
      debounce((amount: string, address: string) => {
        console.log('amount: ', amount);
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
      <BNInput
        label={'Amount'}
        error={amountError.error}
        errorMessage={amountError.message}
        denomination={token.denomination}
        onChange={(val) => {
          setAmountDisplayValue(val.amount);
          setAmountInput(val.bn);
        }}
        value={amountInput as any}
      />

      <Input
        label={'To'}
        value={addressInput}
        error={addressError.error}
        errorMessage={addressError.message}
        onChange={(e) => setAddressInput(e.currentTarget.value)}
      />
      <SendAntConfirm
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        amount={amountDisplayValue as string}
        address={address as string}
        fee={'0'}
        extraTxs={[] as any}
        amountUsd={'0'}
        onConfirm={() =>
          submit(amountDisplayValue as string).then(() => resetForm())
        }
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
