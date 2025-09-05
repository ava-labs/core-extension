import { TotpCodeField } from '@/components/TotpCodeField';
import { useKeyboardShortcuts, useTotpErrorMessage } from '@core/ui';
import { useState } from 'react';

export const AuthenticatorVerifyTotp = ({ onChange, isLoading, error }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totpError = useTotpErrorMessage(error);
  // const keyboardShortcuts = useKeyboardShortcuts({
  //   Enter: () => onSubmit(code),
  // });

  return (
    <TotpCodeField
      error={isSubmitted && !!totpError}
      helperText={isSubmitted && totpError}
      onChange={(e) => {
        onChange(e.target.value);
        if (error && !isLoading) {
          setIsSubmitted(false);
        }
      }}
      // {...keyboardShortcuts}
    />
  );
};
