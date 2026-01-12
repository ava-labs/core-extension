import { getEstimatedBridgingTime } from '@avalabs/bridge-unified';
import { BridgeType } from '@avalabs/bridge-unified';
import {
  AlertCircleIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BridgeTimeWarningProps {
  bridgeType?: BridgeType;
  targetChainName?: string;
}

export const BridgeEstimatedTimeWarning = ({
  bridgeType,
  targetChainName,
}: BridgeTimeWarningProps) => {
  const { t } = useTranslation();
  const [estimatedTime, setEstimatedTime] = useState<number>();
  const theme = useTheme();

  useEffect(() => {
    if (bridgeType) {
      setEstimatedTime(getEstimatedBridgingTime(bridgeType));
    }
  }, [bridgeType]);

  if (!bridgeType || !estimatedTime || !targetChainName) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography variant="caption" color={theme.palette.error.main}>
        {t(
          'Bridging to {{targetChain}} can take up to {{estimatedTime}} hours',
          {
            targetChain: targetChainName,
            estimatedTime,
          },
        )}
      </Typography>

      <AlertCircleIcon size={16} color={theme.palette.error.main} />
    </Stack>
  );
};
