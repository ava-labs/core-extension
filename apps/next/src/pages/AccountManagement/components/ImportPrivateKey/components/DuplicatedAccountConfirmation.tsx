import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useAnalyticsContext } from '@core/ui';

type DuplicatedAccountConfirmationProps = {
  onImportDuplicate: () => void;
  onCancel: () => void;
};

export const DuplicatedAccountConfirmation = ({
  onImportDuplicate,
  onCancel,
}: DuplicatedAccountConfirmationProps) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const submitHandler = useCallback(() => {
    capture('ImportPrivateKeyConfirmDuplicateClicked');
    onImportDuplicate();
  }, [onImportDuplicate, capture]);

  const cancelHandler = useCallback(() => {
    capture('ImportPrivateKeyConfirmDuplicateCanceled');
    onCancel();
  }, [onCancel, capture]);

  return (
    <Stack sx={{ height: '100%', mt: '23px' }}>
      <Typography
        variant="h2"
        sx={{
          textWrap: 'balance',
          '&.MuiTypography-root': {
            fontWeight: 700,
          },
        }}
      >
        {t('This account has already been imported')}
      </Typography>

      <Stack sx={{ rowGap: '10px', mt: 'auto' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          onClick={submitHandler}
        >
          {t('Import duplicate')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={cancelHandler}
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};
