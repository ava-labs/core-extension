import {
  Avatar,
  Card,
  CardActionArea,
  CardProps,
  ExternalLinkIcon,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-components';

import { DefiProtocol } from '@src/background/services/defi/models';
import { useCurrenciesContext } from '@src/contexts/CurrenciesProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { getCurrencyFormatter } from '@src/contexts/utils/getCurrencyFormatter';
import { openNewTab } from '@src/utils/extensionUtils';
import { useMemo } from 'react';

type DefiProtocolListItemProps = CardProps & {
  protocol: DefiProtocol;
};

export const DefiProtocolListItem = ({
  protocol,
  ...cardProps
}: DefiProtocolListItemProps) => {
  const theme = useTheme();
  const { convert, hasExchangeRate } = useCurrenciesContext();
  const { currency, currencyFormatter } = useSettingsContext();
  const usdFormatter = useMemo(() => getCurrencyFormatter('USD'), []);

  const openUrl = (url) => openNewTab({ url });

  const value = useMemo((): string => {
    // We may not have the value in user's selected currency,
    // so we need to ensure we show the correct currency code/symbol.
    const needsConversion = currency !== 'USD';
    const canConvert = hasExchangeRate('USD', currency);
    const converted =
      needsConversion && canConvert
        ? convert({ amount: protocol.totalUsdValue, from: 'USD', to: currency })
        : null;

    return converted !== null
      ? currencyFormatter(converted)
      : usdFormatter(protocol.totalUsdValue);
  }, [
    protocol.totalUsdValue,
    currency,
    hasExchangeRate,
    usdFormatter,
    currencyFormatter,
    convert,
  ]);

  return (
    <Card sx={{ width: '100%' }} {...cardProps}>
      <CardActionArea data-testid={`defi-protocol-${protocol.id}`}>
        <Stack
          direction="row"
          sx={{
            height: 60,
            py: 1.5,
            px: 2,
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar
            src={protocol.logoUrl}
            alt={protocol.name}
            secondarySrc={protocol.chainLogoUrl}
            secondaryAvatarProps={{
              sx: {
                width: 14,
                height: 14,
                border: `1px solid ${theme.palette.grey[900]}`,
              },
            }}
            badgeProps={{
              'data-testid': `defi-protocol-chain-${protocol.chainId}`,
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            }}
          />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
            data-testid="defi-protocol-name"
          >
            {protocol.name}
          </Typography>
          <Stack sx={{ alignItems: 'flex-end' }}>
            <Typography
              variant="button"
              sx={{ fontSize: 14 }}
              data-testid="defi-protocol-value"
            >
              {value}
            </Typography>
            <IconButton
              component="a"
              size="small"
              sx={{ mr: -0.5 }}
              onClick={() => openUrl(protocol.siteUrl)}
              data-testid="defi-protocol-link"
            >
              <ExternalLinkIcon size={16} />
            </IconButton>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};
