import {
  Box,
  Stack,
  Tooltip,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { Quote } from '@avalabs/unified-asset-transfer';

import { useSettingsContext } from '@core/ui';

import { useFusionState } from '../../../contexts';
import { useTransferTokensLookup } from '../../../hooks/useTransferTokensLookup';
import { SwapFeesBreakdown } from './SwapFeesBreakdown';
import { aggregateQuoteFees } from './lib/aggregateQuoteFees';

type SwapFeesProps = TypographyProps & {
  quote: Quote;
};

const SwapFees: FC<SwapFeesProps> = ({ quote, ...props }) => {
  const quoteTokens = useTransferTokensLookup(quote);
  const { currencyFormatter } = useSettingsContext();

  const feesSum = aggregateQuoteFees(quote, quoteTokens);

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
  const { selectedQuote } = useFusionState();

  if (!selectedQuote) {
    return null;
  }

  return <SwapFees quote={selectedQuote} {...props} />;
};

export { SwapFeesGate as SwapFees };
