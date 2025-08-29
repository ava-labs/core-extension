import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { PageTopBar } from '@/components/PageTopBar';
import { MdInfoOutline } from 'react-icons/md';

type NetworkUpdateConfirmationProps = {
  onBack: () => void;
  onSubmit: () => void;
};

export const NetworkUpdateConfirmation = ({
  onBack,
  onSubmit,
}: NetworkUpdateConfirmationProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      height="100cqh"
      width={1}
      bgcolor="background.backdrop"
      overflow="hidden"
    >
      <PageTopBar showBack={true} onBackClicked={onBack} />

      <Stack px={1.5} pb={1.5} gap={3} flexGrow={1}>
        <Typography variant="h2">{t('Do you really want to save?')}</Typography>

        <Stack direction="row" gap={1} alignItems="center">
          <MdInfoOutline color={theme.palette.error.main} />
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            {t('Core functionality may be unstable with custom RPC URLs')}
          </Typography>
        </Stack>
      </Stack>

      {/* Bottom Buttons */}
      <Stack
        width="100%"
        gap={1}
        sx={{
          pt: 2,
          px: 1.5,
          pb: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          onClick={onSubmit}
        >
          {t('Save')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={onBack}
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};
