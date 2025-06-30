import { Button, Stack, styled } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onRename: () => void;
  onRemove: () => void;
};

export const ActionButtons: FC<Props> = ({ onRename, onRemove }) => {
  const { t } = useTranslation();

  return (
    <Stack mt="auto" gap={1}>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={onRename}
      >
        {t('Rename')}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={onRemove}
      >
        <PanicButtonText>{t('Remove account')}</PanicButtonText>
      </Button>
    </Stack>
  );
};

const PanicButtonText = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
}));
