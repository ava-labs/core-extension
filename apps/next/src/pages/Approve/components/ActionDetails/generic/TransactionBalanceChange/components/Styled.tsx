import { FC, memo, useState } from 'react';
import {
  Box,
  Stack,
  StackProps,
  styled,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';

import { useDynamicFontSize } from '@/hooks/useDynamicFontSize';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';

export const ResponsiveTokenAmount: FC<{ amount: string; negate: boolean }> =
  memo(({ amount, negate }) => {
    const [container, setContainer] = useState<HTMLSpanElement | null>(null);

    const { fontSize, measureElement } = useDynamicFontSize({
      minFontSize: 18,
      maxFontSize: 27,
      maxWidth: container?.clientWidth ?? Infinity,
      text: negate ? `-${amount}` : amount,
    });

    return (
      <Box position="relative" ref={setContainer}>
        {measureElement()}
        <CollapsedTokenAmount
          regularProps={{
            fontSize: fontSize,
          }}
          amount={negate ? `-${amount}` : `+${amount}`}
        />
      </Box>
    );
  });

ResponsiveTokenAmount.displayName = 'ResponsiveTokenAmount';

export const TokenSymbol = styled((props: TypographyProps) => (
  <Typography {...props} variant="h7" color="text.primary" />
))`
  font-weight: 500;
`;

export const TokenBalanceChangeWrapper = styled((props: StackProps) => (
  <Stack direction="row" gap={1.5} px={2} py={1} {...props} />
))`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;
