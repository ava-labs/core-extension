import { FC, useMemo } from 'react';
import { CardProps, Stack, Typography } from '@avalabs/k2-alpine';

import {
  DefiCommonItem,
  DefiInsuranceBuyerItem,
  DefiItem,
  DefiItemType,
  DefiVestingItem,
  DefiLendingItem,
  DefiRewardItem,
  DefiPerpetualItem,
  DefiItemGroup,
} from '@core/types';

import { DeFiProtocolLending } from './DeFiProtocolLending';
import { DeFiProtocolCommon } from './DeFiProtocolCommon';
import { DeFiProtocolRewards } from './DeFiProtocolRewards';
import { DeFiProtocolVesting } from './DeFiProtocolVesting';
import { DeFiProtocolInsurance } from './DeFiProtocolInsurance';
import { DeFiProtocolPerpetual } from './DeFiProtocolPerpetual';

import { useTranslation } from 'react-i18next';

import { StyledCard } from './Styled';

type DeFiProtocolItemGroupProps = {
  group: DefiItemGroup;
  cardProps?: CardProps;
};

export const DeFiProtocolItemGroup: FC<DeFiProtocolItemGroupProps> = ({
  group,
  cardProps,
}) => {
  const { t } = useTranslation();

  /**
   * Group the items by type
   */
  const itemsByType = useMemo(() => {
    return group.items.reduce(
      (acc, item) => {
        acc[item.type] = [...(acc[item.type] || []), item];
        return acc;
      },
      {} as Record<DefiItemType, DefiItem[]>,
    );
  }, [group.items]);

  return (
    <Stack key={group.name} direction="column" gap={1.5} pb={2}>
      <Typography variant="subtitle2" fontWeight="semibold">
        {t(group.name)}
      </Typography>
      <StyledCard {...cardProps}>
        <Stack direction="column" gap={0.5}>
          {Object.entries(itemsByType).map(([type, items]) => {
            const key = `defi-group-${type}`;

            switch (type) {
              case DefiItemType.Lending:
                return (
                  <DeFiProtocolLending
                    key={key}
                    items={items as DefiLendingItem[]}
                  />
                );

              case DefiItemType.Reward:
                return (
                  <DeFiProtocolRewards
                    key={key}
                    items={items as DefiRewardItem[]}
                  />
                );

              case DefiItemType.Vesting:
                return (
                  <DeFiProtocolVesting
                    key={key}
                    items={items as DefiVestingItem[]}
                  />
                );

              case DefiItemType.InsuranceBuyer:
                return (
                  <DeFiProtocolInsurance
                    key={key}
                    items={items as DefiInsuranceBuyerItem[]}
                  />
                );

              case DefiItemType.Perpetual:
                return (
                  <DeFiProtocolPerpetual
                    key={key}
                    items={items as DefiPerpetualItem[]}
                  />
                );

              default:
                return (
                  <DeFiProtocolCommon
                    key={key}
                    items={items as DefiCommonItem[]}
                  />
                );
            }
          })}
        </Stack>
      </StyledCard>
    </Stack>
  );
};
