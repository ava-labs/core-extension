import { Stack, styled } from '@avalabs/k2-alpine';
import { useEffect, useRef } from 'react';
import { PersonalAvatar, PersonalAvatarName } from '../PersonalAvatar';

const AvatarGridRow = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  minWidth: 'max-content',
  width: 'max-content',
  '&:nth-of-type(n+2)': {
    marginTop: theme.spacing(-1.5),
  },
  '&:nth-of-type(even)': {
    marginLeft: '45px',
  },
}));

type AvatarRowsProps = {
  avatarRows: PersonalAvatarName[][];
  selected?: PersonalAvatarName;
  onSelect: (avatar: PersonalAvatarName) => void;
};

export const AvatarRows = ({
  avatarRows,
  selected,
  onSelect,
}: AvatarRowsProps) => {
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, []);

  return (
    <>
      {avatarRows.map((row, index) => (
        <AvatarGridRow key={index}>
          {row.map((avatar) => (
            <PersonalAvatar
              ref={avatar === selected ? selectedRef : undefined}
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
    </>
  );
};
