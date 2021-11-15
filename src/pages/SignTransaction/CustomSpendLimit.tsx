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
  //   Radio,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { truncateAddress } from '@src/utils/truncateAddress';

export function CustomSpendLimit({ onCancel, onSpendLimitChanged, token }) {
  // }: {
  //   token: ERC20TOken;
  //   onSpendLimitChanged(spendLimit: string): void;
  //   onCancel(): void;
  // }) {
  const { avaxToken, addresses } = useWalletContext();
  const [customSpendLimit, setCustomSpendLimit] = useState<string>('');
  const theme = useTheme();

  function handleOnSave() {
    onSpendLimitChanged(customSpendLimit);
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
              {truncateAddress(addresses.addrC)}
            </Typography>
            <Typography weight={700} height="22px" padding="0 0 4px 0">
              {avaxToken.balanceDisplayValue}
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
        <VerticalFlex>
          <HorizontalFlex>
            <input
              type="radio"
              value={'unlimited'}
              name="unlimitedGroup"
              id="unlimited"
            />
            <Typography>Unlimited</Typography>
          </HorizontalFlex>
          <HorizontalFlex>
            <input
              type="radio"
              value={'custom'}
              name="unlimitedGroup"
              id="custom"
            />
            <VerticalFlex width="100%">
              <Typography>Custom Spend Limit</Typography>
              <BNInput
                onChange={(value) => setCustomSpendLimit(value.amount)}
                denomination={token.denomination}
                placeholder="Maximum Limit"
              />
            </VerticalFlex>
          </HorizontalFlex>
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
