import { getAvatarDataUri, PersonalAvatar } from '@/components/PersonalAvatar';
import { FC, useState } from 'react';
import { ScrollableAvatars } from '../ScrollableAvatars';
import * as Styled from './Styled';
import { getAvatarName } from './utils';

type Props = {
  name: string;
  dataUri: string | undefined;
  onChange: (avatarDataUri: string) => void;
};

export const ContactAvatar: FC<Props> = ({ name, dataUri, onChange }) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAvatarName, setSelectedAvatarName] = useState(() =>
    getAvatarName(dataUri),
  );

  if (selectionMode) {
    return (
      <ScrollableAvatars
        selected={selectedAvatarName}
        onSelect={async (newAvatar) => {
          setSelectedAvatarName(newAvatar);
          onChange(await getAvatarDataUri(newAvatar));
          setSelectionMode(false);
        }}
      />
    );
  }

  return (
    <Styled.Wrapper
      role="button"
      tabIndex={0}
      onClick={() => setSelectionMode(true)}
    >
      <PersonalAvatar dataUri={dataUri ?? ''} size="large" alt={name} />
      <Styled.EditIcon size={24} />
    </Styled.Wrapper>
  );
};
