import { Stack, Typography } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { BalanceColumn } from 'packages/ui/src/components/common/BalanceColumn';
import { TokenWithBalancePVM } from '@avalabs/vm-module-types';
import { TokenUnit } from '@avalabs/core-utils-sdk';

interface PchainActiveNetworkWidgetContentProps {
  balances?: TokenWithBalancePVM;
}

export function PchainActiveNetworkWidgetContent({
  balances,
}: PchainActiveNetworkWidgetContentProps) {
  const { t } = useTranslation();

  const typeDisplayNames = {
    lockedStaked: t('Locked Staked'),
    lockedStakeable: t('Locked Stakeable'),
    lockedPlatform: t('Locked Platform'),
    atomicMemoryLocked: t('Atomic Memory Locked'),
    atomicMemoryUnlocked: t('Atomic Memory Unlocked'),
    unlockedUnstaked: t('Unlocked Unstaked'),
    unlockedStaked: t('Unlocked Staked'),
    pendingStaked: t('Pending Staked'),
  };

  if (!balances?.balancePerType) {
    return null;
  }
  return (
    <>
      {Object.entries(balances.balancePerType).map(([type, balance]) => {
        const show = balance > 0;

        if (!show) {
          return null;
        }

        return (
          <Stack
            key={`pchain-balance-${type}`}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            margin="0 -16px"
            padding="4px 16px"
          >
            <Stack direction="row" alignItems="center">
              <Typography
                data-testid="token-row-name"
                variant="caption"
                sx={{ ml: 1 }}
              >
                {typeDisplayNames[type]}
              </Typography>
            </Stack>
            <BalanceColumn className="balance-column">
              <Typography
                className="balance"
                data-testid="token-row-token-balance"
                variant="caption"
              >
                {new TokenUnit(
                  balance,
                  balances.decimals,
                  balances.symbol,
                ).toDisplay()}{' '}
                AVAX
              </Typography>
            </BalanceColumn>
          </Stack>
        );
      })}
    </>
  );
}
