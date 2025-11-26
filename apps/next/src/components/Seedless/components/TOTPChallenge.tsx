import { Page } from '@/components/Page';
import { Button, Typography } from '@avalabs/k2-alpine';
import { AuthErrorCode } from '@core/types';
import { useTotpErrorMessage } from '@core/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyledStackRootTOTP,
  StyledStackTOTP,
  StyledTextField,
} from '../styled';

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
    <Page title={t('Verify Code')} withBackButton={false}>
      <StyledStackRootTOTP>
        <Typography variant="body1">
          {t('Enter the code generated from your authenticator app.')}
        </Typography>
        <StyledTextField
          autoFocus
          fullWidth
          rows={1}
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
      </StyledStackRootTOTP>
      <StyledStackTOTP>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => onSubmit(code)}
          loading={isLoading}
          disabled={!code || isLoading}
          fullWidth
        >
          {isLoading ? t('Verifying...') : t('Verify')}
        </Button>
      </StyledStackTOTP>
    </Page>
  );
};
