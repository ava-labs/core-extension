import {
  HorizontalFlex,
  BNInput,
  PrimaryButton,
  Typography,
  VerticalFlex,
  SubTextTypography,
  SecondaryCard,
  Radio,
  ComponentSize,
} from '@avalabs/react-components';
import { useState } from 'react';
import { ERC20WithBalance } from '@avalabs/wallet-react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { DomainMetadata } from '@src/background/models';
import { PageTitle } from '@src/components/common/PageTitle';

export enum Limit {
  DEFAULT = 'DEFAULT',
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

  const handleOnSave = () => {
    setSpendLimit(customSpendLimit);
    onClose();
  };

  return (
    <VerticalFlex width="100%">
      <PageTitle onBackClick={() => onClose()}>Edit Limit</PageTitle>

      {/* Content middle */}
      <VerticalFlex padding="8px 16px 0">
        {/* Balance */}
        <Typography size={12} height="15px" padding="0 0 4px 0">
          Balance
        </Typography>
        <SecondaryCard padding="16px" direction="column">
          <Typography height="24px" padding="0 0 8px 0">
            {activeAccount?.name}
          </Typography>
          <Typography weight={600} height="24px">
            {token.balanceDisplayValue} {token.symbol}
          </Typography>
        </SecondaryCard>

        {/* Spending Limit */}
        <Typography weight={500} size={14} height="24px" margin="24px 0 0">
          Spending limit
        </Typography>
        <SubTextTypography size={12} height="15px" margin="4px 0 0">
          Set a limit that you will allow {site.domain} to withdraw and spend.
        </SubTextTypography>

        {/* Radio */}
        <VerticalFlex margin="24px 0 0 0">
          <HorizontalFlex align="center" margin="0 0 0 8px">
            <Radio
              onChange={() => {
                setCustomSpendLimit({
                  ...customSpendLimit,
                  limitType: Limit.DEFAULT,
                });
              }}
              value={Limit.DEFAULT}
              name="unlimitedGroup"
              id="default"
              checked={customSpendLimit.limitType === Limit.DEFAULT}
            />
            <Typography margin="0 0 0 16px" weight={600}>
              Default
            </Typography>
          </HorizontalFlex>
          <HorizontalFlex align="center" margin="24px 0 0 8px">
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
            <Typography margin="0 0 0 16px" weight={600}>
              Unlimited
            </Typography>
          </HorizontalFlex>
          <HorizontalFlex align="center" margin="24px 0 0 8px">
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
            <Typography margin="0 0 0 16px" weight={600}>
              Custom Spend Limit
            </Typography>
          </HorizontalFlex>
          <VerticalFlex width="100%" padding="16px 0 0 48px">
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
              width="100%"
            />
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>

      <HorizontalFlex
        flex={1}
        align="flex-end"
        width="100%"
        padding="0 16px 8px"
      >
        <PrimaryButton
          size={ComponentSize.LARGE}
          width="100%"
          onClick={handleOnSave}
        >
          Save
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
