import { getEstimatedBridgingTime } from '@avalabs/bridge-unified';
import { BridgeType } from '@avalabs/bridge-unified';
import {
  AlertCircleIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { NetworkWithCaipId } from '@core/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BridgeTimeWarningProps {
  bridgeType?: BridgeType;
  targetChain?: NetworkWithCaipId;
}

export const BridgeEstimatedTimeWarning = ({
  bridgeType,
  targetChain,
}: BridgeTimeWarningProps) => {
  const { t } = useTranslation();
  const [estimatedTime, setEstimatedTime] = useState<number>();
  const theme = useTheme();

  useEffect(() => {
    if (bridgeType) {
      setEstimatedTime(getEstimatedBridgingTime(bridgeType));
    }
  }, [bridgeType]);

  if (!bridgeType || !estimatedTime || !targetChain) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography variant="caption" color={theme.palette.error.main}>
        {t(
          'Bridging to {{targetChain}} can take up to {{estimatedTime}} hours',
          {
            targetChain: targetChain?.chainName,
            estimatedTime,
          },
        )}
      </Typography>

      <AlertCircleIcon size={16} color={theme.palette.error.main} />
    </Stack>
  );
};
