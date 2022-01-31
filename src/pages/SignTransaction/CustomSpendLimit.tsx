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
  SecondaryCard,
  Radio,
} from '@avalabs/react-components';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { ERC20WithBalance } from '@avalabs/wallet-react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { DomainMetadata } from '@src/background/models';

export enum Limit {
  UNLIMITED = 'UNLIMITED',
  CUSTOM = 'CUSTOM',
}

export interface SpendLimit {
  limitType: Limit;
  value?: {
    bn: any;
    amount: string;
  };
}

export function CustomSpendLimit({
  spendLimit,
  token,
  onClose,
  setSpendLimit,
  site,
}: {
  token: ERC20WithBalance;
  setSpendLimit(limitData: SpendLimit): void;
  onClose(): void;
  spendLimit: SpendLimit;
  site: DomainMetadata;
}) {
  const { activeAccount } = useAccountsContext();
  const [customSpendLimit, setCustomSpendLimit] = useState<SpendLimit>({
    ...spendLimit,
  });
  const theme = useTheme();

  const handleOnSave = () => {
    setSpendLimit(customSpendLimit);
    onClose();
  };

  return (
    <VerticalFlex width="100%" margin="24px 0 0 0">
      {/* Header */}
      <HorizontalFlex align="center">
        <TextButton onClick={() => onClose()} margin="0 108px 0 0">
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
        <SecondaryCard padding="8px 16px" margin="0 0 34px 0">
          <VerticalFlex>
            <Typography height="24px" padding="0 0 8px 0">
              {activeAccount?.name}
            </Typography>
            <Typography weight={700} height="22px" padding="0 0 4px 0">
              {token.balanceDisplayValue} {token.symbol}
            </Typography>
          </VerticalFlex>
        </SecondaryCard>

        {/* Spending Limit */}
        <Typography weight={600} height="24px" padding="0 0 4px 0">
          Spending limit
        </Typography>
        <SubTextTypography size={14} height="17px">
          Set a limit that you will allow {site.domain} to withdraw and spend.
        </SubTextTypography>

        {/* Radio */}
        <VerticalFlex margin="24px 0 0 0">
          <HorizontalFlex align="center" margin="0 0 40px 0">
            <Radio
              onChange={() => {
                setCustomSpendLimit({
                  ...customSpendLimit,
                  limitType: Limit.UNLIMITED,
                });
              }}
              value={Limit.UNLIMITED}
              name="unlimitedGroup"
              id="unlimited"
              checked={customSpendLimit.limitType === Limit.UNLIMITED}
            />
            <Typography margin="0 0 0 24px" weight={600}>
              Unlimited
            </Typography>
          </HorizontalFlex>
          <HorizontalFlex align="center" margin="0 0 16px 0">
            <Radio
              onChange={() => {
                setCustomSpendLimit({
                  ...customSpendLimit,
                  limitType: Limit.CUSTOM,
                });
              }}
              value={Limit.CUSTOM}
              name="unlimitedGroup"
              id="custom"
              checked={customSpendLimit.limitType === Limit.CUSTOM}
            />
            <Typography margin="0 0 0 24px" weight={600}>
              Custom Spend Limit
            </Typography>
          </HorizontalFlex>
          <VerticalFlex width="100%" align="flex-end" padding="0 8px 0 0">
            <BNInput
              onChange={(value) => {
                setCustomSpendLimit({
                  ...customSpendLimit,
                  value,
                  limitType: Limit.CUSTOM,
                });
              }}
              denomination={token.denomination}
              placeholder="Maximum Limit"
              value={customSpendLimit.value?.bn}
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
