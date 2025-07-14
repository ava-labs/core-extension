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
      <Typography variant="h2" sx={{ textWrap: 'balance' }}>
        {t('This account has already been imported')}
      </Typography>

      <Stack sx={{ rowGap: '10px', mt: 'auto' }}>
        <Button
          onClick={onImportDuplicate}
          sx={{ backgroundColor: 'text.primary', color: 'background.default' }}
        >
          {t('Import duplicate')}
        </Button>
        <Button
          onClick={onCancel}
          sx={{ backgroundColor: 'glass.light2', color: 'text.primary' }}
        >
          {t('cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};
