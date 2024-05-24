import { Stack, Typography } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { BalanceColumn } from '@src/components/common/BalanceColumn';
import { TokenWithBalanceAVM } from '@src/background/services/balances/models';

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
                {`${balances[type]} AVAX`}
              </Typography>
            </BalanceColumn>
          </Stack>
        );
      })}
    </>
  );
}
