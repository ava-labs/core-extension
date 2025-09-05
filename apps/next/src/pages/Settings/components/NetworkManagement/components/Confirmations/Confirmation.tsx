import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { PageTopBar } from '@/components/PageTopBar';
import { MdInfoOutline } from 'react-icons/md';

type ConfirmationProps = {
  onBack: () => void;
  onSubmit: () => void;
  title: string;
  warningText: string;
  primaryButtonText: string;
  secondaryButtonText: string;
};

export const Confirmation = ({
  onBack,
  onSubmit,
  title,
  warningText,
  primaryButtonText,
  secondaryButtonText,
}: ConfirmationProps) => {
  const theme = useTheme();

  return (
    <Stack
      height="100cqh"
      width={1}
      bgcolor="background.backdrop"
      overflow="hidden"
    >
      <PageTopBar showBack={true} onBackClicked={onBack} />

      <Stack px={1.5} pb={1.5} gap={3} flexGrow={1}>
        <Typography variant="h2" sx={{ width: '90%' }}>
          {title}
        </Typography>

        <Stack direction="row" gap={1} alignItems="center">
          <MdInfoOutline color={theme.palette.error.main} size={24} />
          <Typography variant="body3" sx={{ color: 'error.main' }}>
            {warningText}
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
        position="sticky"
        bottom={0}
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          onClick={onSubmit}
        >
          {primaryButtonText}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={onBack}
        >
          {secondaryButtonText}
        </Button>
      </Stack>
    </Stack>
  );
};
