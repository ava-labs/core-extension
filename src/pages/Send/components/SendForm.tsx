import {
  ComponentSize,
  TextArea,
  VerticalFlex,
  HorizontalFlex,
  SubTextTypography,
  BNInput,
  Typography,
} from '@avalabs/react-components';
import {
  isERC20Token,
  SendAntFormError,
  SendAvaxFormError,
} from '@avalabs/wallet-react-components';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useSend } from '../hooks/useSend';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { debounceTime, Subject } from 'rxjs';

interface SendFormProps {
  sendState: ReturnType<typeof useSend>;
}

const AddressInput = styled(TextArea)`
  word-break: break-all;
`;

export function SendForm({ sendState }: SendFormProps) {
  const { currencyFormatter } = useSettingsContext();
  const selectedToken = useTokenFromParams();
  const [amountInput, setAmountInput] = useState<BN>();
  const [addressInput, setAddressInput] = useState<string>('');
  const [amountDisplayValue, setAmountDisplayValue] = useState<string>('');

  const setValuesDebouncedSubject = useMemo(() => {
    return new Subject<{
      amount?: string;
      address?: string;
      reset?: boolean;
    }>();
  }, []);

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

  const resetForm = () => {
    setAddressInput('');
    setAmountInput(undefined);
    setAmountDisplayValue('');

    updateSendState({ reset: true });
  };

  const showAmountErrorMessage =
    sendState?.errors.amountError.message &&
    (
      [
        SendAntFormError.AMOUNT_REQUIRED,
        SendAvaxFormError.AMOUNT_REQUIRED,
      ] as string[]
    ).includes(sendState.errors.amountError.message);

  const onAddressChanged = (address: string) => {
    setAddressInput(address);
    updateSendState({ address });
  };

  const onAmountChanged = (val: { bn: BN; amount: string }) => {
    setAmountInput(val.bn);
    setAmountDisplayValue(val.amount);
    updateSendState({ amount: val.amount });
  };
  return (
    <VerticalFlex align="center" width="100%">
      <AddressInput
        size={ComponentSize.SMALL}
        margin="32px 0 0 0"
        label={'Address'}
        value={addressInput}
        error={sendState?.errors.addressError.error}
        errorMessage={sendState?.errors.addressError.message}
        placeholder="Enter the address"
        onChange={(e) =>
          onAddressChanged((e.nativeEvent.target as HTMLInputElement).value)
        }
      />
      <VerticalFlex margin="16px 0" grow="1">
        <BNInput
          value={amountInput}
          label={'Amount'}
          error={sendState?.errors.amountError.error}
          errorMessage={
            showAmountErrorMessage ? sendState?.errors.amountError.message : ''
          }
          placeholder="Enter the amount"
          denomination={selectedToken.denomination || 18}
          max={sendState?.maxAmount}
          onChange={(val) => {
            onAmountChanged(val);
          }}
        />
        {(!showAmountErrorMessage || !sendState?.errors.amountError.error) && (
          <HorizontalFlex
            width={'100%'}
            justify={'space-between'}
            align={'center'}
            margin={'8px 0 0 0'}
          >
            <Typography size={14} height="16px">
              {selectedToken?.priceUSD
                ? currencyFormatter(
                    Number(amountDisplayValue || 0) * selectedToken.priceUSD
                  )
                : ''}
            </Typography>
            <HorizontalFlex align="center">
              {sendState?.sendFee && (
                <SubTextTypography size={12} height="16px" margin="0 8px 0 0">
                  Transaction fee: ~
                  {Utils.bnToLocaleString(sendState?.sendFee || new BN(0), 18)}{' '}
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
        )}
      </VerticalFlex>
    </VerticalFlex>
  );
}
