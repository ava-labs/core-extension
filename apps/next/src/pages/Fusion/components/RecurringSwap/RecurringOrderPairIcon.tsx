import { Stack } from '@avalabs/k2-alpine';
import { MdCompareArrows } from 'react-icons/md';

import { TokenAvatar } from '@/components/TokenAvatar';

import type { RecurringSwapOrderToken } from '../../hooks/useRecurringSwapOrders';

type RecurringOrderPairIconProps = {
  sourceToken: RecurringSwapOrderToken;
  targetToken: RecurringSwapOrderToken;
};

const AVATAR_SIZE = 42;
const BADGE_SIZE = 20;

export const RecurringOrderPairIcon = ({
  sourceToken,
  targetToken,
}: RecurringOrderPairIconProps) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="center"
    gap={1}
    flexShrink={0}
  >
    <TokenAvatar
      token={sourceToken}
      size={AVATAR_SIZE}
      badgeSize={BADGE_SIZE}
    />
    <Stack color="text.primary" lineHeight={0}>
      <MdCompareArrows size={24} />
    </Stack>
    <TokenAvatar
      token={targetToken}
      size={AVATAR_SIZE}
      badgeSize={BADGE_SIZE}
    />
  </Stack>
);
