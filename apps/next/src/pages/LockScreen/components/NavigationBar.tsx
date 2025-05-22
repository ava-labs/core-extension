import { IconButton, Stack } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { MdArrowBack } from 'react-icons/md';

type Props = {
  showBack: boolean;
  onBackClicked(): void;
};

export const NavigationBar: FC<Props> = ({ showBack, onBackClicked }) => {
  return (
    <Stack
      position="absolute"
      top={0}
      left={0}
      right={0}
      alignItems="start"
      zIndex={9999999}
    >
      {showBack && (
        <IconButton onClick={onBackClicked}>
          <MdArrowBack />
        </IconButton>
      )}
    </Stack>
  );
};
