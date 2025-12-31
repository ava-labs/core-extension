import { getEstimatedBridgingTime, BridgeType } from '@avalabs/bridge-unified';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdError as AlertCircleIcon } from 'react-icons/md';

type Props = {
  bridgeType?: BridgeType;
  targetChainName?: string;
};

export const BridgeEstimatedTimeWarning: FC<Props> = ({
  bridgeType,
  targetChainName,
}) => {
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
