import { TrendingToken } from '@core/types';
import { Avatar, Box, Button, Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useSettingsContext } from '@core/ui';
import { formatCurrency } from '../../utils/formatAmount';
import upIcon from '../../assets/up.svg';
import downIcon from '../../assets/down.svg';

type TokenCardProps = {
  token: TrendingToken;
  last: boolean;
};
const UNKNOWN_AMOUNT = '-';

export const TokenCard = ({ token, last }: TokenCardProps) => {
  const rank = token.rank;
  const { currency } = useSettingsContext();
  const { t } = useTranslation();

  const formattedPercent = useMemo(
    () =>
      token.price24hChangePercent
        ? Math.abs(token.price24hChangePercent)?.toFixed(2).toString() + '%'
        : undefined,
    [token.price24hChangePercent],
  );

  const formattedPrice = useMemo(
    () =>
      token.price
        ? formatCurrency({
            amount: token.price,
            currency,
            boostSmallNumberPrecision: true,
          })
        : UNKNOWN_AMOUNT,
    [currency, token.price],
  );

  const percentChangeIcon = useMemo(() => {
    if (token.price24hChangePercent && token.price24hChangePercent > 0) {
      return upIcon;
    }
    return downIcon;
  }, [token.price24hChangePercent]);

  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      pt={1}
    >
      {/* Left side - Avatar */}
      <Box position="relative" sx={{ transform: 'translateY(-2px)' }}>
        <Avatar
          alt={token.symbol}
          src={token.logoURI || undefined}
          sx={{ width: 36, height: 36 }}
        >
          {token.symbol}
        </Avatar>
        {rank === 1 && (
          <Box
            position="absolute"
            top={-16}
            right={-2}
            sx={{
              transform: 'rotate(25deg)',
              fontSize: '21px',
              zIndex: 1,
            }}
          >
            👑
          </Box>
        )}
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        flexGrow={1}
        ml={2}
        pb={1}
        borderBottom={last ? undefined : '1px solid'}
        borderColor={last ? undefined : 'divider'}
      >
        {/* Middle left side - Token info */}
        <Stack>
          <Typography>
            {rank}. {token.name}
          </Typography>
          <Typography color="text.secondary">{token.symbol}</Typography>
        </Stack>

        <Stack
          justifyContent="space-between"
          alignItems="center"
          flexGrow={1}
          direction="row"
          columnGap={1.5}
        >
          {/* Middle right side - Price and percent change */}
          <Stack alignItems="flex-end" ml="auto">
            <Typography color="text.secondary">{formattedPrice}</Typography>
            <Stack direction="row" gap={1}>
              <img src={percentChangeIcon} alt="percent change" />
              <Typography color="text.secondary">{formattedPercent}</Typography>
            </Stack>
          </Stack>

          {/* Right side - Buy button */}
          <Button size="small" variant="contained" color="secondary">
            {t('Buy')} {/* TODO: add buy button logic */}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
