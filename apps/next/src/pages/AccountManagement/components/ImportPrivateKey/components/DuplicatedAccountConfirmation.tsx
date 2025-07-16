import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

type DuplicatedAccountConfirmationProps = {
  onImportDuplicate: () => void;
  onCancel: () => void;
};

export const DuplicatedAccountConfirmation = ({
  onImportDuplicate,
  onCancel,
}: DuplicatedAccountConfirmationProps) => {
  const { t } = useTranslation();
  return (
    <Stack sx={{ height: '100%', mt: '23px' }}>
      <Typography variant="h2" sx={{ textWrap: 'balance', fontWeight: '700' }}>
        {t('This account has already been imported')}
      </Typography>

      <Stack sx={{ rowGap: '10px', mt: 'auto' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          onClick={onImportDuplicate}
        >
          {t('Import duplicate')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={onCancel}
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};
