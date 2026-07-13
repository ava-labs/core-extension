import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Fade, Stack, Typography } from '@avalabs/k2-alpine';

type InsufficientFeeWarningProps = {
  visible: boolean;
};

export const InsufficientFeeWarning: FC<InsufficientFeeWarningProps> = ({
  visible,
}) => {
  const { t } = useTranslation();

  return (
    <Fade in={visible} mountOnEnter unmountOnExit>
      <Stack textAlign="center">
        <Typography variant="caption" color="error.main">
          {t('Insufficient balance for fee')}
        </Typography>
      </Stack>
    </Fade>
  );
};
