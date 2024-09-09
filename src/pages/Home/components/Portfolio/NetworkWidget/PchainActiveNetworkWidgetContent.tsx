import { Stack, Typography } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { BalanceColumn } from '@src/components/common/BalanceColumn';
import { TokenWithBalancePVM } from '@avalabs/vm-module-types';

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

  if (!balances) {
    return null;
  }
  return (
    <>
      {Object.keys(typeDisplayNames).map((type) => {
        const show = balances[type] && balances[type] > 0;

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
                {`${balances[type]} AVAX`}
              </Typography>
            </BalanceColumn>
          </Stack>
        );
      })}
    </>
  );
}
