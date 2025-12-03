import {
  FullscreenModal,
  FullscreenModalContent,
} from '@/components/FullscreenModal';
import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';

interface VerifyGoBackModalProps {
  isOpen: boolean;
  onBack: () => void;
  onCancel: () => void;
}

export const VerifyGoBackModal: FC<VerifyGoBackModalProps> = ({
  isOpen,
  onBack,
  onCancel,
}: VerifyGoBackModalProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <FullscreenModal onBack={onBack} open={isOpen} onClose={onCancel}>
      <FullscreenModalContent>
        <Stack
          gap={2}
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          padding={0}
          marginTop={-8}
        >
          <FiAlertCircle size={30} color={theme.palette.error.main} />
          <Stack gap={1} maxWidth={393}>
            <Typography variant="h7" color="error.main" textAlign="center">
              {t('Do you want to go back?')}
            </Typography>
            <Typography
              variant="subtitle1"
              color="error.main"
              textAlign="center"
            >
              {t(
                'Going back will take you to the beginning of the onboarding flow. You will need to re-verify the MFA you just set up before continuing with account creation.',
              )}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="secondary" onClick={onCancel}>
              {t('Cancel')}
            </Button>
            <Button variant="contained" color="primary" onClick={onBack}>
              {t('Go Back')}
            </Button>
          </Stack>
        </Stack>
      </FullscreenModalContent>
    </FullscreenModal>
  );
};
