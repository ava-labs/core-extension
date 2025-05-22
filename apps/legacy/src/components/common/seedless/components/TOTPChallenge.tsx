import {
  Button,
  Stack,
  TextField,
  Typography,
} from '@avalabs/core-k2-components';
import { AuthErrorCode } from '@core/types';
import { PageTitle, PageTitleVariant } from '@/components/common/PageTitle';
import { useTotpErrorMessage } from '@core/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  error?: AuthErrorCode;
  isLoading: boolean;
  onSubmit: (code: string) => void;
};
export const TOTPChallenge = ({ error, isLoading, onSubmit }: Props) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const errorMessage = useTotpErrorMessage(error);

  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
      }}
    >
      <PageTitle
        showBackButton={false}
        variant={PageTitleVariant.PRIMARY}
        margin="0"
      >
        {t('Verify Code')}
      </PageTitle>
      <Stack
        sx={{
          mt: 2,
          gap: 3,
          px: 2,
        }}
      >
        <Typography variant="body1">
          {t('Enter the code generated from your authenticator app.')}
        </Typography>
        <TextField
          autoFocus
          fullWidth
          rows={3}
          multiline
          InputProps={{
            readOnly: isLoading,
          }}
          onChange={(event) => setCode(event.target.value)}
          type="tel"
          onKeyDown={(event) => {
            // Allow verifying by clicking Enter if we're not awaiting response yet.
            if (event.key === 'Enter') {
              event.preventDefault();

              if (code) {
                onSubmit(code);
              }
            }
          }}
          error={!!errorMessage}
          helperText={errorMessage}
        />
      </Stack>
      <Stack sx={{ flexGrow: 1, justifyContent: 'flex-end', py: 3, px: 2 }}>
        <Button
          color="primary"
          size="large"
          onClick={() => onSubmit(code)}
          isLoading={isLoading}
          disabled={!code || isLoading}
          fullWidth
        >
          {isLoading ? t('Verifying...') : t('Verify')}
        </Button>
      </Stack>
    </Stack>
  );
};
