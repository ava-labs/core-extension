import { AVATAR_ROWS, AvatarRows } from '@/components/Avatar';
import { NoScrollStack } from '@/components/NoScrollStack';
import { PersonalAvatarName } from '@/components/PersonalAvatar';
import { CSSProperties, FC } from 'react';

type Props = {
  selected: PersonalAvatarName | undefined;
  onSelect: (avatar: PersonalAvatarName) => void;
};

const STYLE: CSSProperties = {
  height: '157px',
  scrollBehavior: 'smooth',
};

export const ScrollableAvatars: FC<Props> = ({ selected, onSelect }) => (
  <NoScrollStack style={STYLE}>
    <AvatarRows
      avatarRows={AVATAR_ROWS}
      selected={selected}
      onSelect={onSelect}
    />
  </NoScrollStack>
);
