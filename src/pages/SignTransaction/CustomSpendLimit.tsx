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
import { useWalletContext } from '@src/contexts/WalletProvider';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { ERC20WithBalance } from '@avalabs/wallet-react-components';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

enum Limit {
  UNLIMITED = 'UNLIMITED',
  CUSTOM = 'CUSTOM',
}

export function CustomSpendLimit({
  onCancel,
  onSpendLimitChanged,
  token,
  limit,
}: {
  limit: string;
  token: ERC20WithBalance;
  onSpendLimitChanged(spendLimit: string): void;
  onCancel(): void;
}) {
  const { avaxToken, addresses } = useWalletContext();
  const { activeAccount } = useAccountsContext();
  const [customSpendLimit, setCustomSpendLimit] = useState<string>('');
  const [checked, setChecked] = useState<Limit>(Limit.UNLIMITED);
  const theme = useTheme();

  console.log(addresses);

  useEffect(() => {
    if (!customSpendLimit || checked === Limit.UNLIMITED) {
      setCustomSpendLimit(limit);
    }
  }, [limit, checked]);

  function handleOnChange(e: any) {
    setChecked(e.target.value);
  }

  function handleOnSave() {
    if (checked === Limit.UNLIMITED) {
      // set customSpendLimit to BIG NUMBER
      setCustomSpendLimit('reallybignumber');
    }

    console.log(customSpendLimit);

    // onSpendLimitChanged(customSpendLimit);
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
              {avaxToken.balanceDisplayValue} AVAX
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
              onSelectChange={handleOnChange}
              value={Limit.UNLIMITED}
              name="unlimitedGroup"
              id="unlimited"
              checked={checked === Limit.UNLIMITED}
            />
            <Typography margin="0 0 0 24px">Unlimited</Typography>
          </HorizontalFlex>
          <HorizontalFlex align="center" margin="0 0 16px 0">
            <Radio
              onSelectChange={handleOnChange}
              value={Limit.CUSTOM}
              name="unlimitedGroup"
              id="custom"
              checked={checked === Limit.CUSTOM}
            />
            <Typography margin="0 0 0 24px">Custom Spend Limit</Typography>
          </HorizontalFlex>
          <VerticalFlex width="100%">
            <BNInput
              onChange={(value) => setCustomSpendLimit(value.amount)}
              denomination={token.denomination}
              placeholder="Maximum Limit"
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
