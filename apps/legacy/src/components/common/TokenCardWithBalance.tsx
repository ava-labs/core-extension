import { Card, Stack, Tooltip, Typography } from '@avalabs/core-k2-components';
import { useEffect, useRef, useState } from 'react';
import { TokenWithBalance } from '@avalabs/vm-module-types';

import { PAndL } from './ProfitAndLoss';
import { MaliciousTokenWarningIcon } from './MaliciousTokenWarning';

interface TokenCardProps {
  name: string;
  symbol: string;
  balanceDisplayValue?: string | number;
  children?: JSX.Element;
  balanceInCurrency?: string;
  onClick?(): void;
  currencyFormatter?: (balanceInCurrency: number) => string;
  currency?: string;
  priceChanges?: TokenWithBalance['priceChanges'];
  isMalicious?: boolean;
}

export function TokenCardWithBalance({
  name,
  balanceDisplayValue,
  symbol,
  onClick,
  balanceInCurrency,
  children,
  currencyFormatter,
  currency,
  priceChanges,
  isMalicious,
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
            sx={{ width: '100%', gap: 1 }}
          >
            {isMalicious && <MaliciousTokenWarningIcon />}
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
            {balanceInCurrency && (
              <Typography variant="body2">
                {currencyFormatter
                  ? currencyFormatter(Number(balanceInCurrency))
                  : balanceInCurrency}
                {currency && ` ${currency}`}
              </Typography>
            )}
          </Stack>

          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Stack sx={{ alignItems: 'flex-end', flexDirection: 'row' }}>
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
            {priceChanges && (
              <Stack>
                <PAndL
                  value={priceChanges.value}
                  percentage={priceChanges.percentage}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
