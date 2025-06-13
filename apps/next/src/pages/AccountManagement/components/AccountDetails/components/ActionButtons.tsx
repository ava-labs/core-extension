import { Stack, Button, styled } from '@avalabs/k2-alpine';
import { FC } from 'react';

type Props = {
  onRename: () => void;
  onRemove: () => void;
};

export const ActionButtons: FC<Props> = ({ onRename, onRemove }) => (
  <Stack mt="auto" gap={1} flexBasis={32}>
    <Button variant="text" color="error" size="small" onClick={onRename}>
      Rename
    </Button>
    <Button
      variant="contained"
      color="secondary"
      size="small"
      onClick={onRemove}
    >
      <PanicButtonText>Remove account</PanicButtonText>
    </Button>
  </Stack>
);

const PanicButtonText = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
}));
