import { FC, useState } from 'react';
import {
  ChevronDownIcon,
  Collapse,
  Divider,
  IconButton,
  Stack,
  StackProps,
  styled,
} from '@avalabs/k2-alpine';
import {
  NetworkContractToken,
  NetworkToken,
  TokenDiffItem,
} from '@avalabs/vm-module-types';

import { OverflowingTypography } from '@/components/OverflowingTypography';

import * as Styled from './Styled';
import { TokenLogo } from './TokenLogo';
import { DARK_THEME_SURFACE_COLOR } from '@/config';

type BatchTokenBalanceChangeProps = {
  token: NetworkToken | NetworkContractToken;
  items: TokenDiffItem[];
  direction: 'loss' | 'gain';
};

export const BatchTokenBalanceChange: FC<BatchTokenBalanceChangeProps> = ({
  token,
  items,
  direction,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Styled.TokenBalanceChangeWrapper direction="column">
      <AccordionHeader role="button" onClick={() => setIsOpen((open) => !open)}>
        <TokenNameWrapper>
          <OverflowingTypography variant="h7" fontWeight={500}>
            {token.name} {items.length ? `(${items.length})` : ''}
          </OverflowingTypography>
        </TokenNameWrapper>
        <IconButton size="small">
          <AccordionIndicator isOpen={isOpen} />
        </IconButton>
      </AccordionHeader>
      <Collapse in={isOpen} sx={{ width: '100%' }}>
        <Stack width="100%" divider={<Divider sx={{ mx: 2 }} />}>
          {items.map((item, index) => (
            <Styled.TokenBalanceChangeWrapper key={index} pl={1} pr={1.5}>
              <Stack direction="row" gap={1} alignItems="center" flexShrink={0}>
                <TokenLogo logoUri={token.logoUri} size={24} />
                <Styled.TokenSymbol>{token.symbol}</Styled.TokenSymbol>
              </Stack>
              <Stack
                textAlign="end"
                color={direction === 'loss' ? 'error.main' : 'text.primary'}
                overflow="hidden"
              >
                <OverflowingTypography variant="h7" fontWeight={500}>
                  {direction === 'loss'
                    ? `-${item.displayValue}`
                    : `+${item.displayValue}`}
                </OverflowingTypography>
              </Stack>
            </Styled.TokenBalanceChangeWrapper>
          ))}
        </Stack>
      </Collapse>
    </Styled.TokenBalanceChangeWrapper>
  );
};

/**
 * Harder to style the actual <Accordion /> for this use case than write a custom one.
 */
const AccordionHeader = styled((props: StackProps) => (
  <Stack gap={1} role="button" {...props} />
))`
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : DARK_THEME_SURFACE_COLOR};
  position: sticky;
  top: 56px;
  z-index: 1;
`;

const TokenNameWrapper: FC<StackProps> = (props) => (
  <Stack
    direction="row"
    gap={1}
    alignItems="center"
    overflow="hidden"
    width="100%"
    height={36}
    {...props}
  />
);

type AccordionIndicatorProps = {
  isOpen: boolean;
};

const AccordionIndicator = styled(ChevronDownIcon, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<AccordionIndicatorProps>(({ isOpen, theme }) => ({
  transition: theme.transitions.create('transform'),
  transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
}));
