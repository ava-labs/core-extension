import { useTranslation } from 'react-i18next';
import {
  InfoCircleIcon,
  Stack,
  Typography,
  Tooltip,
} from '@avalabs/core-k2-components';
import { VeloraIcon } from '@src/components/icons/VeloraIcon';
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
        icon: <VeloraIcon />,
        notice: t("You will interact directly with Velora's smart contracts."),
      };
    }

    if (network.vmName === NetworkVMType.SVM) {
      return {
        icon: <img src={JupiterLogo} alt="Jupiter" />,
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
      <Stack sx={{ flexDirection: 'row' }}>
        <Tooltip placement={'top'} title={engineInfo.notice}>
          <InfoCircleIcon size="16px" />
        </Tooltip>
      </Stack>
    </Stack>
  );
}
