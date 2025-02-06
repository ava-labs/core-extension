import type {
  AvatarGroupProps,
  AvatarProps,
} from '@avalabs/core-k2-components';
import { Avatar, AvatarGroup } from '@avalabs/core-k2-components';
import type { DefiToken } from '@src/background/services/defi/models';
import { useMemo } from 'react';

type Props = AvatarGroupProps & {
  tokens: DefiToken[];
  // The maximum number of tokens displayed by neighboring portfolio items.
  // This is so that we get an equal (but the narrowest possible) column width
  // for all portfolio items.
  maxTokens: number;
};

const MAX_DISPLAYED_AVATARS = 3;
const AVATAR_SIZE = 16;
const AVATAR_PROPS: AvatarProps = {
  imgProps: {
    loading: 'lazy',
  },
  sx: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
};

export const DefiTokenAvatarGroup = ({ tokens, maxTokens, ...rest }: Props) => {
  const width = useMemo(
    () =>
      AVATAR_SIZE +
      (Math.min(MAX_DISPLAYED_AVATARS, maxTokens) - 1) * (AVATAR_SIZE / 2),
    [maxTokens],
  );

  return (
    <AvatarGroup
      {...rest}
      max={MAX_DISPLAYED_AVATARS}
      sx={{
        width,
        gap: 0.5,
        justifyContent: 'start',
        display: 'inline-flex',
      }}
      slotProps={{
        additionalAvatar: {
          ...AVATAR_PROPS,
          style: {
            fontSize: '9px',
          },
        },
      }}
    >
      {tokens.map((token) => (
        <Avatar
          {...AVATAR_PROPS}
          data-testid="defi-item-token-avatar"
          key={token.symbol}
          src={token.logoUrl}
          alt={token.name}
        />
      ))}
    </AvatarGroup>
  );
};
