import { WarningMessage } from '@/components/WarningMessage';
import { Button, Stack } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  ref?: React.RefObject<HTMLDivElement>;
  onExit: () => void;
  onBack: () => void;
  fullscreen: boolean;
};

export const ExitConfirmation: FC<Props> = ({
  onExit,
  onBack,
  ref,
  fullscreen,
}) => {
  const { t } = useTranslation();

  return (
    <Stack ref={ref} height={1}>
      <WarningMessage my={2}>
        {t(
          'Closing the settings menu will require you to restart the 2 day waiting period.',
        )}
      </WarningMessage>
      <Stack direction="row" gap={1} mt="auto">
        <Button
          variant="contained"
          size={fullscreen ? 'large' : 'extension'}
          color="secondary"
          onClick={onExit}
          fullWidth
          data-testid="seedless-export-recovery-phrase-confirm-close"
        >
          {t('Exit')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size={fullscreen ? 'large' : 'extension'}
          onClick={onBack}
          fullWidth
          data-testid="seedless-export-recovery-phrase-cancel-close"
        >
          {t('Back')}
        </Button>
      </Stack>
    </Stack>
  );
};
