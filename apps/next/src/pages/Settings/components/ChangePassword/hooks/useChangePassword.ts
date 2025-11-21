import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { toast } from '@avalabs/k2-alpine';
import { useWalletContext, useAnalyticsContext } from '@core/ui';

type ChangePasswordErrors = Partial<{
  general: string;
  currentPassword: string;
}>;

const INITIAL_ERRORS: ChangePasswordErrors = {};

export function useChangePassword(
  currentPassword: string,
  newPassword: string,
) {
  const { changeWalletPassword } = useWalletContext();
  const { goBack } = useHistory();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const currentPasswordRef = useRef<string>(currentPassword);
  const newPasswordRef = useRef<string>(newPassword);
  currentPasswordRef.current = currentPassword;
  newPasswordRef.current = newPassword;

  const [errors, setErrors] = useState<ChangePasswordErrors>(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentPassword) {
      setErrors(INITIAL_ERRORS);
    }
  }, [currentPassword]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    capture('ChangePasswordClicked');

    try {
      const success = await changeWalletPassword(
        newPasswordRef.current,
        currentPasswordRef.current,
      );

      if (success) {
        toast.success(t('Password changed successfully'));
        capture('ChangePasswordSucceeded');
        goBack();
      } else {
        setErrors({
          general: t('Failed to change password'),
        });
        capture('ChangePasswordFailed');
      }
    } catch {
      setErrors({
        currentPassword: t('Current password is incorrect'),
      });
      capture('ChangePasswordFailed');
    } finally {
      setIsSubmitting(false);
    }
  }, [changeWalletPassword, t, goBack, capture]);

  return { handleSubmit, isSubmitting, errors };
}
