import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdError as AlertCircleIcon } from 'react-icons/md';
import { ServiceType } from '@avalabs/unified-asset-transfer';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';

type Props = {
  hours: number;
};

const SwapEstimatedTimeWarning: FC<Props> = ({ hours }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      gap={1}
    >
      <Typography variant="caption" color={theme.palette.error.main}>
        {t('This operation can take up to {{hours}} hours', {
          hours,
        })}
      </Typography>

      <AlertCircleIcon size={16} color={theme.palette.error.main} />
    </Stack>
  );
};

type GateProps = {
  serviceType: ServiceType;
};

const SwapEstimatedTimeWarningGate: FC<GateProps> = ({ serviceType }) => {
  const hours = getEstimatedSwapTimeInHours(serviceType);

  if (!hours) {
    return null;
  }

  return <SwapEstimatedTimeWarning hours={hours} />;
};

const getEstimatedSwapTimeInHours = (serviceType: ServiceType) => {
  switch (serviceType) {
    case ServiceType.LOMBARD_BTCB_TO_BTC:
      return 6;

    default:
      return null;
  }
};

export { SwapEstimatedTimeWarningGate as SwapEstimatedTimeWarning };
