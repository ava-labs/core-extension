import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/core-k2-components';

import {
  DefiCommonItem,
  DefiInsuranceBuyerItem,
  DefiItem,
  DefiItemGroup,
  DefiItemType,
  DefiLendingItem,
  DefiPerpetualItem,
  DefiRewardItem,
  DefiVestingItem,
} from '@src/background/services/defi/models';

import { DefiPortfolioLending } from './DefiPortfolioLending';
import { DefiPortfolioCommon } from './DefiPortfolioCommon';
import { DefiPortfolioRewards } from './DefiPortfolioRewards';
import { DefiPortfolioVesting } from './DefiPortfolioVesting';
import { DefiPortfolioInsurance } from './DefiPortfolioInsurance';
import { DefiPortfolioPerpetual } from './DefiPortfolioPerpetual';

type Props = {
  group: DefiItemGroup;
};

export const DefiPortfolioItemGroup = ({ group }: Props) => {
  const { t } = useTranslation();
  const header = useMemo(
    () => (group.name === 'Rewards' ? t('Pool') : t('Supplied')),
    [group.name, t]
  );
  const itemsByType = useMemo(
    () =>
      group.items.reduce((grouped, item) => {
        if (!grouped[item.type]) {
          grouped[item.type] = [item];
        } else {
          grouped[item.type].push(item);
        }

        return grouped;
      }, {} as Record<DefiItemType, DefiItem[]>),
    [group]
  );

  return (
    <Stack sx={{ gap: 2 }} data-testid="defi-protocol-group">
      <Stack sx={{ pt: 1, justifyContent: 'center' }}>
        <Typography variant="h6" data-testid="defi-protocol-group-name">
          {t(group.name)}
        </Typography>
      </Stack>
      <Stack sx={{ gap: 2, pb: 2 }}>
        {Object.entries(itemsByType).map(([type, items]) => {
          const key = `defi-group-${type}`;

          switch (type) {
            case DefiItemType.Lending:
              return (
                <DefiPortfolioLending
                  key={key}
                  items={items as DefiLendingItem[]}
                />
              );

            case DefiItemType.Reward:
              return (
                <DefiPortfolioRewards
                  key={key}
                  items={items as DefiRewardItem[]}
                />
              );

            case DefiItemType.Vesting:
              return (
                <DefiPortfolioVesting
                  key={key}
                  items={items as DefiVestingItem[]}
                />
              );

            case DefiItemType.InsuranceBuyer:
              return (
                <DefiPortfolioInsurance
                  key={key}
                  items={items as DefiInsuranceBuyerItem[]}
                />
              );

            case DefiItemType.Perpetual:
              return (
                <DefiPortfolioPerpetual
                  key={key}
                  items={items as DefiPerpetualItem[]}
                />
              );

            default:
              return (
                <DefiPortfolioCommon
                  key={key}
                  header={header}
                  items={items as DefiCommonItem[]}
                />
              );
          }
        })}
      </Stack>
    </Stack>
  );
};
