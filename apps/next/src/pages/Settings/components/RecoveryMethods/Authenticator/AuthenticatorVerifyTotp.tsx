import { TotpCodeField } from '@/components/TotpCodeField';
import { Button, Stack } from '@avalabs/k2-alpine';
import { AuthErrorCode } from '@core/types';
import { useKeyboardShortcuts, useTotpErrorMessage } from '@core/ui';
import { useTranslation } from 'react-i18next';

interface AuthenticatorVerifyTotpProps {
  onChange: (code: string) => void;
  error?: AuthErrorCode;
  onSubmit?: () => void;
  isSubmitted?: boolean;
}
export const AuthenticatorVerifyTotp = ({
  onChange,
  error,
  onSubmit,
  isSubmitted,
}: AuthenticatorVerifyTotpProps) => {
  const totpError = useTotpErrorMessage(error);
  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: () => onSubmit?.(),
  });
  const { t } = useTranslation();

  return (
    <Stack mt={4} justifyContent="space-between" height="100%">
      <TotpCodeField
        error={!!totpError}
        helperText={totpError}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        {...keyboardShortcuts}
      />
      {onSubmit && (
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          fullWidth
          loading={isSubmitted}
          disabled={isSubmitted}
        >
          {t('Next')}
        </Button>
      )}
    </Stack>
  );
};
