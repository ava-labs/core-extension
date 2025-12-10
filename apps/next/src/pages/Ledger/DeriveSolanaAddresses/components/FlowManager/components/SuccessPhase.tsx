import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { Box, Button, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheckCircleOutline } from 'react-icons/md';

type Props = {
  onClose: () => void;
};

export const SuccessPhase: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <Stack height="100%" width="100%">
      <FullscreenModalTitle></FullscreenModalTitle>
      <FullscreenModalDescription></FullscreenModalDescription>
      <FullscreenModalContent
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <Box color="success.main">
          <MdCheckCircleOutline size={75} />
        </Box>
        <Stack gap={1} textAlign="center">
          <Typography variant="h2">{t('Success!')}</Typography>
          <Typography variant="subtitle1">
            {t('You can now close this tab')}
          </Typography>
        </Stack>
      </FullscreenModalContent>
      <FullscreenModalActions>
        <Stack width="100%" alignItems="center" justifyContent="center">
          <Button variant="contained" color="primary" onClick={onClose}>
            {t("Let's go!")}
          </Button>
        </Stack>
      </FullscreenModalActions>
    </Stack>
  );
};
