import { WarningMessage } from '@/components/WarningMessage';
import { Button, Stack } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PhraseCard } from '../../../../PhraseCard';

type Props = {
  ref?: React.RefObject<HTMLDivElement>;
  fullscreen: boolean;
  mnemonic: string;
  onExit: () => void;
};

export const ExportedMnemonic: FC<Props> = ({
  mnemonic,
  onExit,
  fullscreen,
  ref,
}) => {
  const { t } = useTranslation();

  return (
    <Stack height={1} ref={ref}>
      <Stack gap={2} width={1}>
        <WarningMessage>
          {t('Losing this phrase will result in lost funds')}
        </WarningMessage>

        <PhraseCard phrase={mnemonic} hidden />
      </Stack>

      <Button
        size={fullscreen ? 'large' : 'extension'}
        variant="contained"
        color="primary"
        onClick={onExit}
        fullWidth
        sx={{ mt: 'auto' }}
      >
        {t('Exit')}
      </Button>
    </Stack>
  );
};
