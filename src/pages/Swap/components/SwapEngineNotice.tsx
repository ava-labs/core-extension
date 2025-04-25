import { useTranslation } from 'react-i18next';
import {
  InfoCircleIcon,
  Stack,
  Typography,
  Tooltip,
} from '@avalabs/core-k2-components';
import { ParaswapIcon } from '@src/components/icons/ParaswapIcon';
import JupiterLogo from '@src/images/logos/jupiter-logo.svg';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useMemo } from 'react';
import { NetworkVMType } from '@avalabs/vm-module-types';

export function SwapEngineNotice() {
  const { t } = useTranslation();
  const { network } = useNetworkContext();

  const engineInfo = useMemo(() => {
    if (!network) {
      return null;
    }

    if (network.vmName === NetworkVMType.EVM) {
      return {
        icon: <ParaswapIcon />,
        notice: t(
          "You will interact directly with Paraswap's smart contracts.",
        ),
      };
    }

    if (network.vmName === NetworkVMType.SVM) {
      return {
        icon: <img src={JupiterLogo} alt="Jupiter" />,
        name: '', // Name is included in the logotype
        notice: t('You will interact directly with the Metis router.'),
      };
    }

    return null;
  }, [network, t]);

  if (!engineInfo) {
    return null;
  }

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
      }}
    >
      <Typography variant="caption">{t('Powered by')}</Typography>
      {engineInfo.icon}
      {engineInfo.name && (
        <Typography variant="caption">{engineInfo.name}</Typography>
      )}
      <Stack sx={{ flexDirection: 'row' }}>
        <Tooltip placement={'top'} title={engineInfo.notice}>
          <InfoCircleIcon size="16px" />
        </Tooltip>
      </Stack>
    </Stack>
  );
}
