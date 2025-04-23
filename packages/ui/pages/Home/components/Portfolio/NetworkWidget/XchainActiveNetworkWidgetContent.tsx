import { Stack, Typography } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { BalanceColumn } from 'packages/ui/src/components/common/BalanceColumn';
import { TokenWithBalanceAVM } from '@avalabs/vm-module-types';
import { TokenUnit } from '@avalabs/core-utils-sdk';

interface XchainActiveNetworkWidgetContentProps {
  balances?: TokenWithBalanceAVM;
}

export function XchainActiveNetworkWidgetContent({
  balances,
}: XchainActiveNetworkWidgetContentProps) {
  const { t } = useTranslation();

  const typeDisplayNames = {
    locked: t('Locked'),
    unlocked: t('Unlocked'),
    atomicMemoryLocked: t('Atomic Memory Locked'),
    atomicMemoryUnlocked: t('Atomic Memory Unlocked'),
  };

  if (!balances?.balancePerType) {
    return null;
  }

  return (
    <>
      {Object.entries(balances.balancePerType).map(([type, balanceRaw]) => {
        if (!balanceRaw) {
          return null;
        }

        const balance = new TokenUnit(
          balanceRaw,
          balances.decimals,
          balances.symbol,
        ).toDisplay();

        return (
          <Stack
            key={`xchain-balance-${type}`}
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
                {`${balance} AVAX`}
              </Typography>
            </BalanceColumn>
          </Stack>
        );
      })}
    </>
  );
}
