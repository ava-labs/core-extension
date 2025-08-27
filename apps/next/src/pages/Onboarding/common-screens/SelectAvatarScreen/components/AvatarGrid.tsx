import {
  getHexAlpha,
  Stack,
  StackProps,
  useMediaQuery,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

import { type PersonalAvatarName } from '@/components/PersonalAvatar';
import { AvatarRows } from '@/components/Avatar/AvatarRows';

type AvatarGridProps = Omit<StackProps, 'onSelect'> & {
  avatars: readonly PersonalAvatarName[];
  selected?: PersonalAvatarName;
  onSelect: (avatar: PersonalAvatarName) => void;
};

export const AvatarGrid: FC<AvatarGridProps> = ({
  sx,
  selected,
  avatars,
  onSelect,
  ...props
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery('(max-width: 600px)');
  const oddRowSize = isSmall ? 4 : 5;
  const evenRowSize = isSmall ? 3 : 4;
  const avatarRows = chunkIntoAlternatingSizes(avatars, [
    oddRowSize,
    evenRowSize,
  ]);

  return (
    <Stack
      sx={{
        height: '250px',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        border: 1,
        borderLeft: 0,
        borderRight: 0,
        borderColor: getHexAlpha(theme.palette.primary.main, 10),
      }}
      {...props}
    >
      <AvatarRows
        avatarRows={avatarRows}
        selected={selected}
        onSelect={onSelect}
      />
    </Stack>
  );
};

function chunkIntoAlternatingSizes<T>(
  arr: readonly T[],
  chunkSizes: [number, number],
): T[][] {
  const result: T[][] = [];

  let currentIndex = 0;
  let chunkSizeIndex = 0;

  while (currentIndex < arr.length) {
    const chunkSize = chunkSizes[chunkSizeIndex]!;
    const chunk = arr.slice(currentIndex, currentIndex + chunkSize);
    result.push(chunk);
    currentIndex += chunkSize;
    chunkSizeIndex = (chunkSizeIndex + 1) % chunkSizes.length;
  }

  return result;
}
