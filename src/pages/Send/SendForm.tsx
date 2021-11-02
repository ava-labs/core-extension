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
import BN from 'bn.js';
import { useEffect } from 'react';
import {
  isERC20Token,
  SendAntFormError,
  SendAvaxFormError,
} from '@avalabs/wallet-react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { debounceTime, Subject } from 'rxjs';
import { TransactionFeeTooltip } from './TransactionFeeTooltip';
import styled from 'styled-components';
import { useSend } from './hooks/useSend';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { Utils } from '@avalabs/avalanche-wallet-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

const AddressInput = styled(TextArea)`
  word-break: break-all;
`;

export function SendForm() {
  const sendState = useSend();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [amountInput, setAmountInput] = useState<BN>();
  const { avaxPrice } = useWalletContext();
  const { currencyFormatter } = useSettingsContext();
  const [amountDisplayValue, setAmountDisplayValue] = useState('');
  const tokensWBalances = useTokensWithBalances();
  const selectedToken = useTokenFromParams(tokensWBalances);

  const resetForm = () => {
    setAddressInput('');
    setAmountInput(undefined);
    setAmountDisplayValue('');

    updateSendState({ reset: true });
  };

  const setValuesDebouncedSubject = useMemo(() => {
    return new Subject<{
      amount?: string;
      address?: string;
      reset?: boolean;
    }>();
  }, []);

  const updateSendState = (updates: {
    amount?: string;
    address?: string;
    reset?: boolean;
  }) => {
    const params = {
      amount: amountDisplayValue,
      address: addressInput,
      ...updates,
    };
    setValuesDebouncedSubject.next(params);
  };

  const onAddressChanged = (address: string) => {
    setAddressInput(address);
    updateSendState({ address });
  };

  const onAmountChanged = (val: { bn: BN; amount: string }) => {
    setAmountInput(val.bn);
    setAmountDisplayValue(val.amount);
    updateSendState({ amount: val.amount });
  };

  const showAmountErrorMessage =
    sendState?.errors.amountError.message &&
    (
      [
        SendAntFormError.AMOUNT_REQUIRED,
        SendAvaxFormError.AMOUNT_REQUIRED,
      ] as string[]
    ).includes(sendState.errors.amountError.message);

  useEffect(() => {
    resetForm();
    const subscription = setValuesDebouncedSubject
      .pipe(debounceTime(100))
      .subscribe(({ amount, address, reset }) => {
        if (reset) {
          sendState?.reset();
        } else {
          sendState?.setValues(amount, address);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedToken]);

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
            onAddressChanged((e.nativeEvent.target as HTMLInputElement).value)
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
              onAmountChanged(val);
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
                {currencyFormatter(Number(amountDisplayValue || 0) * avaxPrice)}
              </Typography>
              <HorizontalFlex align="center">
                {sendState?.sendFee && (
                  <SubTextTypography size={12} height="16px" margin="0 8px 0 0">
                    Transaction fee: ~
                    {Utils.bnToLocaleString(
                      sendState?.sendFee || new BN(0),
                      isERC20Token(selectedToken) ? 18 : 9
                    )}{' '}
                    AVAX
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
          token={selectedToken}
          address={sendState?.address as string}
          txId={sendState?.txId}
          chain={sendState?.targetChain}
          fee={
            sendState?.sendFee
              ? Utils.bnToLocaleString(
                  sendState?.sendFee || new BN(0),
                  isERC20Token(selectedToken) ? 18 : 9
                )
              : ''
          }
          extraTxs={sendState?.txs as any}
          amountUsd={currencyFormatter(
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
