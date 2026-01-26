import { getEstimatedBridgingTime, BridgeType } from '@avalabs/bridge-unified';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdError as AlertCircleIcon } from 'react-icons/md';

type Props = {
  hours: number;
};

const BridgeEstimatedTimeWarning: FC<Props> = ({ hours }) => {
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
  bridgeType: BridgeType;
};

const BridgeEstimatedTimeWarningGate: FC<GateProps> = ({ bridgeType }) => {
  const hours = getEstimatedBridgingTime(bridgeType);

  if (!hours) {
    return null;
  }

  return <BridgeEstimatedTimeWarning hours={hours} />;
};

export { BridgeEstimatedTimeWarningGate as BridgeEstimatedTimeWarning };
