import {
  HorizontalFlex,
  Input,
  PrimaryButton,
  TextButton,
  Typography,
  VerticalFlex,
  CaretIcon,
  IconDirection,
  SubTextTypography,
} from '@avalabs/react-components';
import { GasPrice } from '@src/background/services/gas/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import React, { useEffect, useState } from 'react';
import { Utils } from '@avalabs/avalanche-wallet-sdk';
import { useTheme } from 'styled-components';
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
  const theme = useTheme();

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
    <VerticalFlex margin="24px 0 0 0">
      <HorizontalFlex align="center">
        <TextButton onClick={() => onCancel && onCancel()} margin="0 108px 0 0">
          <CaretIcon
            height="20px"
            direction={IconDirection.LEFT}
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography as="h1" size={24} weight={700} align="center">
          Edit Fees
        </Typography>
      </HorizontalFlex>
      <VerticalFlex padding="32px 0 0 0">
        <Typography size={36} weight={700} padding="0 0 8px 0">
          {newFees?.fee}
          <Typography
            padding="0 0 0 4px"
            weight={600}
            color={theme.colors.text2}
          >
            AVAX
          </Typography>
        </Typography>
        <SubTextTypography size={12}>
          Max fee: ({currencyFormatter(Number(newFees?.feeUSD))} AVAX)
        </SubTextTypography>
      </VerticalFlex>
      <Input
        label={'Gas Limit'}
        type={'number'}
        value={customGasLimit}
        onChange={(evt) => setCustomGasLimit(evt.currentTarget.value)}
        margin="24px 0 0 0"
      />
      {/* <br />
      <br />
      <Input
        label={'Tip'}
        type={'number'}
        value={customTipFee}
        onChange={(evt) => setCustomTipFee(evt.currentTarget.value)} */}
      {/* /> */}
      <Input
        label={'Gas Price'}
        type={'number'}
        value={customGasPrice}
        onChange={(evt) => setCustomGasPrice(evt.currentTarget.value)}
        margin="24px 0 0 0"
      />

      <HorizontalFlex flex={1} align="flex-end" width="100%">
        <PrimaryButton width="100%" onClick={handleOnSave}>
          Save
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
