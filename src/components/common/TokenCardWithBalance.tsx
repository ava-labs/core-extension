import { Card, Stack, Tooltip, Typography } from '@avalabs/k2-components';
import { useEffect, useRef, useState } from 'react';

interface TokenCardProps {
  name: string;
  symbol: string;
  balanceDisplayValue?: string | number;
  children?: JSX.Element;
  balanceUSD?: string;
  onClick?(): void;
  currencyFormatter?: (balanceUSD: number) => string;
  currency?: string;
}

export function TokenCardWithBalance({
  name,
  balanceDisplayValue,
  symbol,
  onClick,
  balanceUSD,
  children,
  currencyFormatter,
  currency,
}: TokenCardProps) {
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

  return (
    <Card
      onClick={() => onClick && onClick()}
      sx={{
        py: '10px',
        px: 2,
        borderRadius: '10px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
        <Stack direction="row" sx={{ flex: 0 }}>
          {children}
        </Stack>

        <Stack sx={{ ml: 2, width: '100%' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Tooltip
              placement="bottom"
              title={<Typography variant="caption">{name}</Typography>}
              disableHoverListener={!hasNameOverflow}
              disableFocusListener={!hasNameOverflow}
              sx={{
                flex: 1,
                width: 0,
                cursor: onClick ? 'pointer' : 'default',
              }}
            >
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
                {name}
              </Typography>
            </Tooltip>
            {balanceUSD && (
              <Typography variant="body2">
                {currencyFormatter
                  ? currencyFormatter(Number(balanceUSD))
                  : balanceUSD}
                {currency && ` ${currency}`}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" alignItems="flex-end">
            <Typography variant="body2">
              {balanceDisplayValue?.toLocaleString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ml: balanceDisplayValue !== undefined ? 0.4 : 0,
                color: 'text.secondary',
              }}
            >
              {symbol}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
