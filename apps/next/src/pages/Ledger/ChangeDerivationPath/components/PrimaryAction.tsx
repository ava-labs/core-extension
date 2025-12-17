import { NavButton } from '@/pages/Onboarding/components/NavButton';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmissionState } from '../hooks/useSubmit';

type Props = {
  submissionState: SubmissionState;
  onSubmit: () => void;
  disabled: boolean;
  onClose: () => void;
};

export const PrimaryAction: FC<Props> = ({
  submissionState,
  onSubmit,
  disabled,
  onClose,
}) => {
  const { t } = useTranslation();
  const isLoading = submissionState === 'submitting';
  const isDisabled = disabled || isLoading;
  const onClick =
    submissionState === 'submitted'
      ? onClose
      : submissionState === 'error'
        ? () => window.location.reload()
        : onSubmit;

  return (
    <NavButton
      color="primary"
      loading={isLoading}
      onClick={onClick}
      disabled={isDisabled}
    >
      {submissionState === 'submitted'
        ? t('Done')
        : submissionState === 'error'
          ? t('Close and try again')
          : t('Next')}
    </NavButton>
  );
};
