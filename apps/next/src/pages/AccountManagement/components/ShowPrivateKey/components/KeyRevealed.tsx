import {
  Box,
  Button,
  OutlinedInput,
  outlinedInputClasses,
  Stack,
  styled,
  TextField,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@core/ui';
import { useCopySecretToClipboard } from '@/hooks/useCopySecretToClipboard';

type Props = {
  privateKey: string;
};

const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor: theme.palette.surface.primary,
  ...theme.typography.mono2,
  fontSize: '11px !important',
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    border: 'none',
  },
}));

export const KeyRevealed: FC<Props> = ({ privateKey }) => {
  const { t } = useTranslation();
  const { goBack } = useHistory();
  const { capture } = useAnalyticsContext();
  const copySecret = useCopySecretToClipboard();

  return (
    <Stack height={1} gap={1}>
      <Stack
        gap={1}
        direction="row"
        color="error.main"
        alignItems="center"
        pb={2}
      >
        <Box marginBlock="auto" flexShrink={0}>
          <MdErrorOutline size={24} />
        </Box>
        <Typography variant="subtitle3" flexShrink={1}>
          {t(
            'Anyone with this private key can access the account(s) associated with it',
          )}
        </Typography>
      </Stack>

      <TextField
        defaultValue={privateKey}
        fullWidth
        multiline
        rows={6}
        slots={{
          input: StyledInput,
        }}
        slotProps={{
          input: {
            readOnly: true,
          },
          htmlInput: {
            'data-testid': 'revealed-private-key',
          },
        }}
      />

      <Box mx="auto" py={0.5}>
        <Button
          data-testid="copy-private-key-button"
          variant="contained"
          color="secondary"
          size="xsmall"
          onClick={() => {
            capture('ExportPrivateKeyCopied');
            copySecret(privateKey, 'privateKey');
          }}
        >
          {t('Copy key')}
        </Button>
      </Box>

      <Box mt="auto">
        <Button
          variant="contained"
          color="secondary"
          size="extension"
          fullWidth
          onClick={() => {
            capture('ExportPrivateKeyCancelled');
            goBack();
          }}
        >
          {t('Done')}
        </Button>
      </Box>
    </Stack>
  );
};
