import {
  AvatarGroup,
  avatarClasses,
  avatarGroupClasses,
  Stack,
  styled,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

import { SizedAvatar } from './components';

type TokenAvatarGroupProps = {
  tokens: { symbol: string; logoUrl: string }[];
  size?: number;
};

export const TokenAvatarGroup: FC<TokenAvatarGroupProps> = ({
  tokens,
  size = 24,
}) => {
  return (
    <Stack direction="row" gap={0.5} py={0.5} alignItems="center">
      <StyledAvatarGroup max={4} spacing={16} size={size}>
        {tokens.map((token) => (
          <SizedAvatar key={token.symbol} src={token.logoUrl} size={size} />
        ))}
      </StyledAvatarGroup>
    </Stack>
  );
};

const StyledAvatarGroup = styled(AvatarGroup)<{ size: number }>(
  ({ theme, size }) => ({
    [`& .${avatarClasses.root}`]: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.palette.background.paper,
    },
    [`& .${avatarGroupClasses.avatar}`]: {
      fontSize: '14px',
      width: size,
      height: size,
    },
  }),
);
