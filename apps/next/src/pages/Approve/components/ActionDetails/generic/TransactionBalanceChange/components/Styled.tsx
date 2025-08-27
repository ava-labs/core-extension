import { FC, useMemo, useState } from 'react';
import {
  Stack,
  StackProps,
  styled,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';

import { useDynamicFontSize } from '@/hooks/useDynamicFontSize';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';

export const ResponsiveTokenAmount: FC<{ amount: string; negate: boolean }> = ({
  amount,
  negate,
}) => {
  const [container, setContainer] = useState<HTMLSpanElement | null>(null);
  // We need to memoize the hook options to not look for the perfect font-size on every render.
  // Re-renders will happen multiple times due to fluctuations in the token pricing.
  const width = useMemo(() => container?.clientWidth ?? Infinity, [container]);
  const options = useMemo(
    () => ({
      minFontSize: 18,
      maxFontSize: 27,
      maxWidth: width,
      text: negate ? `-${amount}` : amount,
    }),
    [amount, negate, width],
  );

  const { fontSize, measureElement } = useDynamicFontSize(options);

  return (
    <div style={{ position: 'relative' }} ref={setContainer}>
      {measureElement()}
      <CollapsedTokenAmount
        regularProps={{
          fontSize: fontSize,
        }}
        amount={negate ? `-${amount}` : `+${amount}`}
      />
    </div>
  );
};

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
