import {
  HorizontalFlex,
  BNInput,
  PrimaryButton,
  TextButton,
  Typography,
  VerticalFlex,
  CaretIcon,
  IconDirection,
  SubTextTypography,
  Card,
  Radio,
} from '@avalabs/react-components';
import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { ERC20WithBalance } from '@avalabs/wallet-react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { BN } from '@avalabs/avalanche-wallet-sdk';

export enum Limit {
  UNLIMITED = 'UNLIMITED',
  CUSTOM = 'CUSTOM',
}

export interface CustomSpendLimitBN {
  bn: BN;
  amount: string;
}

export interface SpendLimitType {
  checked: Limit;
  spendLimitBN: CustomSpendLimitBN;
}

export function CustomSpendLimit({
  spendLimit,
  token,
  onCancel,
  onSpendLimitChanged,
  onRadioChange,
}: {
  token: ERC20WithBalance;
  onSpendLimitChanged(limitData: SpendLimitType): void;
  onCancel(): void;
  spendLimit: SpendLimitType;
  onRadioChange(e: any): void;
}) {
  const { activeAccount } = useAccountsContext();
  const [customSpendLimit, setCustomSpendLimit] = useState<CustomSpendLimitBN>(
    spendLimit.spendLimitBN || ({} as CustomSpendLimitBN)
  );
  const theme = useTheme();

  function handleOnSave() {
    let customSpendData: SpendLimitType = {} as SpendLimitType;

    customSpendData = {
      ...spendLimit,
      spendLimitBN: customSpendLimit,
    };

    onSpendLimitChanged(customSpendData);
  }

  return (
    <VerticalFlex width="100%" margin="24px 0 0 0">
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
              {activeAccount?.name}
            </Typography>
            <Typography weight={700} height="22px" padding="0 0 4px 0">
              {token.balanceDisplayValue} {token.symbol}
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

        {/* Radio */}
        <VerticalFlex margin="24px 0 0 0">
          <HorizontalFlex align="center" margin="0 0 40px 0">
            <Radio
              onChange={onRadioChange}
              value={Limit.UNLIMITED}
              name="unlimitedGroup"
              id="unlimited"
              checked={spendLimit.checked === Limit.UNLIMITED}
            />
            <Typography margin="0 0 0 24px" weight={600}>
              Unlimited
            </Typography>
          </HorizontalFlex>
          <HorizontalFlex align="center" margin="0 0 16px 0">
            <Radio
              onChange={onRadioChange}
              value={Limit.CUSTOM}
              name="unlimitedGroup"
              id="custom"
              checked={spendLimit.checked === Limit.CUSTOM}
            />
            <Typography margin="0 0 0 24px" weight={600}>
              Custom Spend Limit
            </Typography>
          </HorizontalFlex>
          <VerticalFlex width="100%" align="flex-end" padding="0 8px 0 0">
            <BNInput
              onChange={(value) => setCustomSpendLimit(value)}
              denomination={token.denomination}
              placeholder="Maximum Limit"
              value={customSpendLimit.bn}
              width="283px"
            />
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>

      <HorizontalFlex flex={1} align="flex-end" width="100%">
        <PrimaryButton width="100%" onClick={handleOnSave}>
          Save
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
