import { Stack, styled } from '@avalabs/k2-alpine';

import { FungibleTokenBalance } from '@core/types';

import { SearchableSelectTriggerProps } from '@/components/SearchableSelect';

export const TokenSelectTrigger = ({
  renderValue,
  value: token,
  ...props
}: SearchableSelectTriggerProps<FungibleTokenBalance>) => (
  <StyledStack {...props}>{renderValue(token)}</StyledStack>
);

const StyledStack = styled(Stack)(({ onClick, theme }) => ({
  cursor: onClick ? 'pointer' : 'default',
  overflow: 'hidden',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  gap: theme.spacing(1),
  width: '100%',
  justifyContent: 'space-between',
}));
