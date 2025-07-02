import {
  Box,
  Button,
  OutlinedInput,
  outlinedInputClasses,
  Stack,
  styled,
  TextField,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

type Props = {
  privateKey: string;
};

const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor: theme.palette.surface.primary,
  fontSize: '10px !important',

  [`& .${outlinedInputClasses.notchedOutline}`]: {
    border: 'none',
  },
}));

export const KeyRevealed: FC<Props> = ({ privateKey }) => {
  const { t } = useTranslation();
  const { goBack } = useHistory();

  return (
    <Stack height={1} gap={1}>
      <Typography variant="h2">
        {t('Here’s the private key for this account')}
      </Typography>

      <Typography variant="body1">
        {t('This key gives access to your account’s addresses')}
      </Typography>

      <Stack gap={1} direction="row" color="error.main" py={2}>
        <Box flexShrink={0}>
          <MdErrorOutline size={24} />
        </Box>
        <Typography variant="subtitle1" flexShrink={1}>
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
        }}
      />

      <Box mx="auto" py={0.5}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(privateKey);
            toast.success(t('Private key copied!'), {
              id: 'private-key-copied',
            });
          }}
        >
          {t('Copy key')}
        </Button>
      </Box>

      <Box mt="auto">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={goBack}
        >
          {t('Done')}
        </Button>
      </Box>
    </Stack>
  );
};
