import { Button, Stack, TextField, Typography } from '@avalabs/k2-components';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { AuthErrorCode } from '@src/hooks/useSeedlessAuth';
import { useTotpErrorMessage } from '@src/hooks/useTotpErrorMessage';
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
              onSubmit(code);
            }
          }}
          error={!!errorMessage}
          helperText={errorMessage}
        />
      </Stack>
      <Stack
        sx={{ flexGrow: 1, justifyContent: 'flex-end', pt: 3, pb: 1, px: 2 }}
      >
        <Button
          color="primary"
          size="large"
          onClick={() => onSubmit(code)}
          isLoading={isLoading}
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? t('Verifying...') : t('Verify')}
        </Button>
      </Stack>
    </Stack>
  );
};
