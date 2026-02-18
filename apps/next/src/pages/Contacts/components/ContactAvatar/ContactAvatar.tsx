import {
  PersonalAvatar,
  PersonalAvatarName,
} from '@/components/PersonalAvatar';
import { ComponentProps, FC, useState } from 'react';
import { ScrollableAvatars } from '../ScrollableAvatars';
import { AvatarEditOverlay } from './components/AvatarEditOverlay';

type Props = {
  name: string;
  selected: PersonalAvatarName | undefined;
  size: NonNullable<ComponentProps<typeof PersonalAvatar>['size']>;
} & Modes;

type Modes =
  | {
      readonly?: true;
      onSelect?: never;
    }
  | {
      readonly?: false;
      onSelect: (avatar: PersonalAvatarName) => void;
    };

export const ContactAvatar: FC<Props> = ({
  name,
  selected,
  onSelect,
  size,
  readonly = true,
}) => {
  const [selectionMode, setSelectionMode] = useState(false);

  if (selectionMode && onSelect) {
    return (
      <ScrollableAvatars
        selected={selected}
        onSelect={(newAvatar) => {
          onSelect(newAvatar);
          setSelectionMode(false);
        }}
      />
    );
  }

  return (
    <AvatarEditOverlay
      onClick={() => setSelectionMode(true)}
      readonly={readonly}
    >
      <PersonalAvatar name={selected ?? ''} size={size} alt={name} />
    </AvatarEditOverlay>
  );
};
