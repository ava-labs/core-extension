import {
  HorizontalFlex,
  Input,
  PrimaryButton,
  SecondaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { GasPrice } from '@src/background/services/gas/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import React, { useEffect, useState } from 'react';
import { Utils } from '@avalabs/avalanche-wallet-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
export function CustomGasLimitAndFees({
  limit,
  gasPrice,
  onSave,
  onCancel,
}: {
  limit: string;
  gasPrice: GasPrice;
  onSave(gasPrice: GasPrice, gasLimit: string): void;
  onCancel(): void;
}) {
  const { avaxPrice } = useWalletContext();
  const { currencyFormatter } = useSettingsContext();
  const [customGasPrice, setCustomGasPrice] = useState<string>('');
  const [customTipFee, setCustomTipFee] = useState<string>('');
  const [customGasLimit, setCustomGasLimit] = useState<string>('');
  const [newFees, setNewFees] =
    useState<ReturnType<typeof calculateGasAndFees>>();

  useEffect(() => {
    if (customGasPrice && customGasLimit) {
      const gas = {
        bn: Utils.stringToBN(customGasPrice, 9),
        value: customGasPrice,
      };

      setNewFees(calculateGasAndFees(gas, customGasLimit, avaxPrice));
    }
  }, [customGasPrice, customTipFee, customGasLimit]);

  useEffect(() => {
    if (!customGasLimit) {
      setCustomGasLimit(limit);
    }

    if (!customGasPrice || Number(customGasPrice) < Number(gasPrice.value)) {
      setCustomGasPrice(gasPrice.value);
    }
  }, [limit, gasPrice]);

  function handleOnSave() {
    const gas = {
      bn: Utils.stringToBN(customGasPrice, 9),
      value: customGasPrice,
    };
    onSave && onSave(gas, customGasLimit);
  }

  return (
    <VerticalFlex>
      <Typography>Edit Fee</Typography>
      <br />
      <VerticalFlex>
        <Typography>{newFees?.fee} AVAX</Typography>
        <Typography>{currencyFormatter(Number(newFees?.feeUSD))}</Typography>
      </VerticalFlex>
      <br />
      <Input
        label={'Gas Limit'}
        type={'number'}
        value={customGasLimit}
        onChange={(evt) => setCustomGasLimit(evt.currentTarget.value)}
      />
      {/* <br />
      <br />
      <Input
        label={'Tip'}
        type={'number'}
        value={customTipFee}
        onChange={(evt) => setCustomTipFee(evt.currentTarget.value)} */}
      {/* /> */}
      <br />
      <br />
      <Input
        label={'Gas Price'}
        type={'number'}
        value={customGasPrice}
        onChange={(evt) => setCustomGasPrice(evt.currentTarget.value)}
      />
      <br />
      <br />
      <HorizontalFlex>
        <SecondaryButton onClick={() => onCancel && onCancel()}>
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={handleOnSave}>Save</PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
