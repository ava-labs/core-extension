import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdInfoOutline } from 'react-icons/md';
import { SlideUpDialog } from '@/components/Dialog';
import { Page } from '@/components/Page';

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
    <SlideUpDialog open={true} onClose={onBack}>
      <Page
        title={title}
        onBack={onBack}
        contentProps={{
          mt: -1.5,
          px: 0,
          alignItems: 'stretch',
          justifyContent: 'space-between',
          height: '100%',
        }}
        containerProps={{
          pb: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack direction="row" gap={1} alignItems="center" flexShrink={0}>
          <MdInfoOutline color={theme.palette.error.main} size={24} />
          <Typography variant="body3" sx={{ color: 'error.main' }}>
            {warningText}
          </Typography>
        </Stack>

        <Stack
          width="100%"
          gap={1}
          position="sticky"
          bottom={0}
          pt={3}
          pb={2}
          flexShrink={0}
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
      </Page>
    </SlideUpDialog>
  );
};
