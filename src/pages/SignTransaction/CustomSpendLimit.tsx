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
  Card,
} from '@avalabs/react-components';
import { GasPrice } from '@src/background/services/gas/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import React, { useEffect, useState } from 'react';
import { Utils } from '@avalabs/avalanche-wallet-sdk';
import { useTheme } from 'styled-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { VerifyPChainError } from '@avalabs/wallet-react-components';

export function CustomSpendLimit({
  // limit,
  // gasPrice,
  // onSave,
  onCancel,
}) {
  // }: {
  //   limit: string;
  //   gasPrice: GasPrice;
  //   onSave(gasPrice: GasPrice, gasLimit: string): void;
  //   onCancel(): void;
  // }) {
  const { avaxPrice } = useWalletContext();
  const { currencyFormatter } = useSettingsContext();
  const [customGasPrice, setCustomGasPrice] = useState<string>('');
  const [customTipFee, setCustomTipFee] = useState<string>('');
  const [customGasLimit, setCustomGasLimit] = useState<string>('');
  const [newFees, setNewFees] =
    useState<ReturnType<typeof calculateGasAndFees>>();
  const theme = useTheme();

  // useEffect(() => {
  //   if (customGasPrice && customGasLimit) {
  //     const gas = {
  //       bn: Utils.stringToBN(customGasPrice, 9),
  //       value: customGasPrice,
  //     };

  //     setNewFees(calculateGasAndFees(gas, customGasLimit, avaxPrice));
  //   }
  // }, [customGasPrice, customTipFee, customGasLimit]);

  // useEffect(() => {
  //   if (!customGasLimit) {
  //     setCustomGasLimit(limit);
  //   }

  //   if (!customGasPrice || Number(customGasPrice) < Number(gasPrice.value)) {
  //     setCustomGasPrice(gasPrice.value);
  //   }
  // }, [limit, gasPrice]);

  function handleOnSave() {
    console.log('do something savey');

    //   const gas = {
    //     bn: Utils.stringToBN(customGasPrice, 9),
    //     value: customGasPrice,
    //   };
    //   onSave && onSave(gas, customGasLimit);
  }

  return (
    <VerticalFlex margin="24px 0 0 0">
      {/* Header */}
      <HorizontalFlex align="center">
        <TextButton onClick={() => onCancel && onCancel()} margin="0 108px 0 0">
          <CaretIcon
            height="20px"
            direction={IconDirection.LEFT}
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography as="h1" size={24} weight={700} align="center">
          Edit Limit
        </Typography>
      </HorizontalFlex>

      {/* Content middle */}
      <VerticalFlex padding="32px 0 0 0">
        {/* Balance */}
        <Typography size={14} padding="0 0 8px 0">
          Balance
        </Typography>
        <Card padding="8px 16px" margin="0 0 34px 0">
          <VerticalFlex>
            <Typography height="24px" padding="0 0 8px 0">
              {'Account here'}
            </Typography>
            <Typography weight={700} height="22px" padding="0 0 4px 0">
              {'Balance here'}
            </Typography>
          </VerticalFlex>
        </Card>

        {/* Spending Limit */}
        <Typography weight={600} height="24px" padding="0 0 4px 0">
          Spending limit
        </Typography>
        <SubTextTypography size={14} height="17px">
          Set a limit that you will allow {'connected dApp here'} to withdraw
          and spend.
        </SubTextTypography>

        {/* Checkbox */}
      </VerticalFlex>

      <HorizontalFlex flex={1} align="flex-end" width="100%">
        <PrimaryButton width="100%" onClick={handleOnSave}>
          Save
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
