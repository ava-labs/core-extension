import {
  Card,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from '@avalabs/k2-components';
import { balanceToDisplayValue } from '@avalabs/utils-sdk';
import {
  TransactionNft,
  TransactionToken,
} from '@src/background/services/transactions/models';
import { useConvertedCurrencyFormatter } from '@src/pages/DeFi/hooks/useConvertedCurrencyFormatter';
import { BN } from 'bn.js';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export enum TransactionTokenCardVariant {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  DEFAULT = 'DEFAULT',
}

export const TransactionTokenCard = ({
  token,
  variant = TransactionTokenCardVariant.DEFAULT,
  sx = {},
  children,
}: {
  token: TransactionToken | TransactionNft;
  variant?: TransactionTokenCardVariant;
  sx?: SxProps<Theme>;
  children?: JSX.Element;
}) => {
  const { t } = useTranslation();
  const currencyFormatter = useConvertedCurrencyFormatter();
  const [hasNameOverflow, setHasNameOverflow] = useState(false);

  const overflowingText = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (checkOverflow(overflowingText.current)) {
      setHasNameOverflow(true);
      return;
    }
    setHasNameOverflow(false);
  }, [overflowingText]);

  const checkOverflow = (textContainer: HTMLSpanElement | null): boolean => {
    if (textContainer) {
      return (
        textContainer.offsetHeight < textContainer.scrollHeight ||
        textContainer.offsetWidth < textContainer.scrollWidth
      );
    }
    return false;
  };

  let balanceDisplayValue: string | undefined;
  if (token['isInfinity']) {
    balanceDisplayValue = t('Unlimited');
  } else {
    balanceDisplayValue = token.amount
      ? balanceToDisplayValue(
          new BN(token.amount.toString()),
          token['decimals'] ?? 0
        )
      : undefined;
  }

  const amountColor =
    variant === TransactionTokenCardVariant.SEND
      ? 'error.light'
      : variant === TransactionTokenCardVariant.RECEIVE
      ? 'success.light'
      : 'text.primary';

  return (
    <Card
      sx={{
        py: '10px',
        px: 2,
        borderRadius: '10px',
        ...sx,
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
        <Stack direction="row" sx={{ flex: 0 }}>
          {children}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ ml: 2, width: '100%' }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Tooltip
              placement="bottom"
              title={<Typography variant="caption">{token.name}</Typography>}
              disableHoverListener={!hasNameOverflow}
              disableFocusListener={!hasNameOverflow}
              sx={{
                flex: 1,
                width: 0,
                flexDirection: 'column',
              }}
            >
              <>
                <Typography
                  ref={overflowingText}
                  variant="h6"
                  fontWeight="fontWeightSemibold"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {token.name}
                </Typography>
                {'collection' in token && token.collection?.name && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {token.collection?.name}
                  </Typography>
                )}
              </>
            </Tooltip>
          </Stack>

          <Stack alignItems="flex-end">
            <Stack direction="row" alignItems="flex-end">
              <Tooltip
                placement="bottom"
                title={
                  <Typography variant="caption">
                    {variant === TransactionTokenCardVariant.SEND ? '-' : ''}
                    {balanceDisplayValue?.toLocaleString()} {token.symbol}
                  </Typography>
                }
              >
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      color: amountColor,
                      maxWidth: '120px',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {variant === TransactionTokenCardVariant.SEND ? '-' : ''}
                    {balanceDisplayValue?.toLocaleString()}
                  </Typography>
                  {'symbol' in token && (
                    <Typography
                      variant="body2"
                      sx={{
                        ml: balanceDisplayValue !== undefined ? 0.4 : 0,
                        color: amountColor,
                      }}
                    >
                      {token.symbol}
                    </Typography>
                  )}
                </>
              </Tooltip>
            </Stack>

            {'usdValue' in token && token.usdValue && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {currencyFormatter
                  ? currencyFormatter(Number(token.usdValue))
                  : token.usdValue}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
