import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { PageTopBar } from '@/components/PageTopBar';
import { MdInfoOutline } from 'react-icons/md';

type RpcUrlResetConfirmationProps = {
  onBack: () => void;
  onSubmit: () => void;
};

export const RpcUrlResetConfirmation = ({
  onBack,
  onSubmit,
}: RpcUrlResetConfirmationProps) => {
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

      <Typography variant="h2">
        {t('Are you sure you want to reset the RPC URL?')}
      </Typography>

      <Stack direction="row" gap={1} alignItems="center">
        <MdInfoOutline color={theme.palette.error.main} />
        <Typography variant="body2" color="error">
          {t('Resetting the RPC URL will set it back to its default URL')}
        </Typography>
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
