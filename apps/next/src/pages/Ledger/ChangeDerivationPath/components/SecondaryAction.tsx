import { NavButton } from '@/pages/Onboarding/components/NavButton';

import { Tooltip } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SubmissionState } from '../hooks/useSubmit';

type Props = {
  submissionState: SubmissionState;
  onClose: () => void;
};

export const SecondaryAction: FC<Props> = ({ submissionState, onClose }) => {
  const { t } = useTranslation();

  if (submissionState === 'submitted' || submissionState === 'error') {
    return null;
  }

  return (
    <Tooltip
      title={t(
        'Clicking the cancel button will close the tab and open the extension for you. If the extension doesn’t open automatically, please open it manually.',
      )}
    >
      <NavButton
        color="secondary"
        onClick={onClose}
        disabled={submissionState === 'submitting'}
      >
        {t('Close')}
      </NavButton>
    </Tooltip>
  );
};
