import {
  Typography,
  VerticalFlex,
  PrimaryButton,
  BNInput,
  HorizontalFlex,
  SubTextTypography,
  ComponentSize,
  TextButton,
  TextArea,
} from '@avalabs/react-components';
import React, { useMemo } from 'react';
import { SendConfirm } from './SendConfirm';
import { useState } from 'react';
import { BN } from 'bn.js';
import { useEffect } from 'react';
import { SendAvaxFormError } from '@avalabs/wallet-react-components';
import { getAvaxBalanceTotal } from '../Wallet/utils/balanceHelpers';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { debounceTime, Subject } from 'rxjs';
import { TransactionFeeTooltip } from './TransactionFeeTooltip';
import styled from 'styled-components';
import { useSend } from './hooks/useSend';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const AddressInput = styled(TextArea)`
  word-break: break-all;
`;

export function SendForm() {
  const sendState = useSend();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [amountInput, setAmountInput] = useState(new BN(0));
  const { avaxPrice } = useWalletContext();
  const [amountDisplayValue, setAmountDisplayValue] = useState('');
  const tokensWBalances = useTokensWithBalances();
  const selectedToken = useTokenFromParams(tokensWBalances);

  function resetForm() {
    setAddressInput('');
    setAmountInput(undefined as any);
    setAmountDisplayValue('');
    sendState?.reset();
  }

  const setValuesDebouncedSubject = useMemo(() => {
    return new Subject<{ amount?: string; address?: string }>();
  }, []);

  const showAmountErrorMessage =
    sendState?.errors.amountError.message &&
    sendState?.errors.amountError.message !== SendAvaxFormError.AMOUNT_REQUIRED;

  useEffect(() => {
    setValuesDebouncedSubject.next({
      amount: amountDisplayValue,
      address: addressInput,
    });
  }, [amountInput, addressInput]);

  useEffect(() => {
    resetForm();
    const subscription = setValuesDebouncedSubject
      .pipe(debounceTime(100))
      .subscribe(({ amount, address }) => {
        sendState?.setValues(amount, address);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedToken]);

  console.log(selectedToken.denomination);

  return (
    <>
      <VerticalFlex align="center" width="100%">
        <AddressInput
          size={ComponentSize.SMALL}
          margin="24px 0 0 0"
          label={'To'}
          value={addressInput}
          error={sendState?.errors.addressError.error}
          errorMessage={sendState?.errors.addressError.message}
          placeholder="Enter the address"
          onChange={(e) =>
            setAddressInput((e.nativeEvent.target as HTMLInputElement).value)
          }
        />
        <VerticalFlex margin="24px 0">
          <BNInput
            value={amountInput}
            label={'Amount'}
            error={sendState?.errors.amountError.error}
            errorMessage={
              showAmountErrorMessage
                ? sendState?.errors.amountError.message
                : ''
            }
            placeholder="Enter the amount"
            denomination={selectedToken.denomination || 9}
            max={sendState?.maxAmount}
            onChange={(val) => {
              setAmountInput(val.bn);
              setAmountDisplayValue(val.amount);
            }}
          />
          {!showAmountErrorMessage || !sendState?.errors.amountError.error ? (
            <HorizontalFlex
              width={'100%'}
              justify={'space-between'}
              align={'center'}
              margin={'8px 0 0 0'}
            >
              <Typography size={14} height="16px">
                {currencyFormatter.format(
                  Number(amountDisplayValue || 0) * avaxPrice
                )}
              </Typography>
              <HorizontalFlex align="center">
                {sendState?.sendFee && (
                  <SubTextTypography size={12} height="16px" margin="0 8px 0 0">
                    Transaction fee: ~
                    {getAvaxBalanceTotal(sendState?.sendFee || new BN(0))} AVAX
                  </SubTextTypography>
                )}
                {sendState?.targetChain === 'C' && (
                  <TransactionFeeTooltip
                    gasPrice={sendState?.gasPrice}
                    gasLimit={sendState?.gasLimit}
                  />
                )}
              </HorizontalFlex>
            </HorizontalFlex>
          ) : (
            ''
          )}
        </VerticalFlex>
        <SendConfirm
          open={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          amount={amountDisplayValue as string}
          address={sendState?.address as string}
          txId={sendState?.txId}
          chain={sendState?.targetChain}
          fee={
            sendState?.sendFee
              ? getAvaxBalanceTotal(sendState?.sendFee || new BN(0))
              : ''
          }
          extraTxs={sendState?.txs as any}
          amountUsd={currencyFormatter.format(
            Number(amountDisplayValue || 0) * avaxPrice
          )}
          onConfirm={() =>
            sendState
              ?.submit(amountDisplayValue as string)
              .then(() => resetForm())
          }
        />
      </VerticalFlex>
      <VerticalFlex align="center" justify="flex-end" width="100%" grow="1">
        <PrimaryButton
          size={ComponentSize.LARGE}
          onClick={() => setShowConfirmation(true)}
          disabled={!sendState?.canSubmit}
          margin="0 0 24px"
        >
          <Typography size={14} color="inherit">
            Continue
          </Typography>
        </PrimaryButton>
        <TextButton
          onClick={() => {
            resetForm();
          }}
        >
          Cancel
        </TextButton>
      </VerticalFlex>
    </>
  );
}
