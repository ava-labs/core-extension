import {
  Box,
  Stack,
  Tooltip,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { FC, useMemo } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import {
  ERC_ZERO_ADDRESS,
  Quote,
  RecurringQuoteFee,
  TokenType,
} from '@avalabs/fusion-sdk';

import { useSettingsContext } from '@core/ui';
import { chainIdToCaip } from '@core/common';

import { useFusionState } from '../../../contexts';
import { useTransferTokensLookup } from '../../../hooks/useTransferTokensLookup';
import { SwapFeesBreakdown } from './SwapFeesBreakdown';
import { aggregateQuoteFees, AggregatableFee } from './lib/aggregateQuoteFees';

type SwapFeesProps = TypographyProps & {
  quote: Quote;
  scheduleFee?: RecurringQuoteFee;
};

const SwapFees: FC<SwapFeesProps> = ({ quote, scheduleFee, ...props }) => {
  const quoteTokens = useTransferTokensLookup(quote);
  const { currencyFormatter } = useSettingsContext();

  const extraFees = useMemo<AggregatableFee[]>(() => {
    if (!scheduleFee) {
      return [];
    }

    const isNative =
      scheduleFee.token.address.toLowerCase() ===
      ERC_ZERO_ADDRESS.toLowerCase();

    return [
      {
        chainId: chainIdToCaip(scheduleFee.token.chainId),
        token: isNative
          ? { type: TokenType.NATIVE }
          : { type: TokenType.ERC20, address: scheduleFee.token.address },
        amount: scheduleFee.amount,
      },
    ];
  }, [scheduleFee]);

  const feesSum = aggregateQuoteFees(quote, quoteTokens, extraFees);

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography variant="body3" {...props}>
        {currencyFormatter(feesSum.amountInFiatCurrency)}
      </Typography>
      <Tooltip
        title={<SwapFeesBreakdown tokenAmounts={feesSum.tokenAmounts} />}
      >
        <Box
          display="flex"
          flexShrink={0}
          lineHeight={1}
          color="text.secondary"
        >
          <MdInfoOutline size={16} />
        </Box>
      </Tooltip>
    </Stack>
  );
};

const SwapFeesGate = (props: TypographyProps) => {
  const { selectedQuote, recurringScheduleFee } = useFusionState();

  if (!selectedQuote) {
    return null;
  }

  return (
    <SwapFees
      quote={selectedQuote}
      scheduleFee={recurringScheduleFee}
      {...props}
    />
  );
};

export { SwapFeesGate as SwapFees };
