import { FC } from 'react';
import {
  getHexAlpha,
  Stack,
  StackProps,
  styled,
  useMediaQuery,
  useTheme,
} from '@avalabs/k2-alpine';

import {
  PersonalAvatar,
  type PersonalAvatarName,
} from '@/components/PersonalAvatar';

type AvatarGridProps = StackProps & {
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
      {avatarRows.map((row, index) => (
        <AvatarGridRow key={index}>
          {row.map((avatar) => (
            <PersonalAvatar
              tabIndex={0}
              key={avatar}
              name={avatar}
              dimmed
              size="medium"
              selected={avatar === selected}
              onClick={() => onSelect(avatar)}
              onKeyDown={(ev) => {
                // On space, select the avatar
                if (ev.key === ' ') {
                  ev.preventDefault();
                  onSelect(avatar);
                } else if (ev.key === 'Enter') {
                  // On enter, select the avatar if it's not already selected.
                  // Otherwise let the event bubble up to the parent, which will
                  // navigate to the next screen.
                  if (avatar !== selected) {
                    ev.stopPropagation();
                    onSelect(avatar);
                  }
                }
              }}
            />
          ))}
        </AvatarGridRow>
      ))}
    </Stack>
  );
};

const AvatarGridRow = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  '&:nth-of-type(n+2)': {
    marginTop: theme.spacing(-1.5),
  },
}));

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
