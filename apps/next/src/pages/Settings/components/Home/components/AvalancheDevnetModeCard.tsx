import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse, Stack, TextField } from '@avalabs/k2-alpine';

import { toast, useNetworkContext } from '@core/ui';
import { isProductionBuild, isUrlValid } from '@core/common';

import { SwitchCard } from '@/components/SwitchCard';

const AvalancheDevnetModeCard = () => {
  const { avalancheDevnetMode, isDeveloperMode, updateAvalancheDevnetMode } =
    useNetworkContext();
  const { t } = useTranslation();

  const updateRpcUrl = useCallback(
    (newUrl: string) => {
      if (!isUrlValid(newUrl)) {
        toast.error(t('Invalid URL'));
        return;
      }

      updateAvalancheDevnetMode({ rpcUrl: newUrl })
        .then(() => {
          toast.success(t('Devnet RPC URL updated'));
        })
        .catch(() => {
          toast.error(t('Failed to update devnetRPC URL'));
        });
    },
    [updateAvalancheDevnetMode, t],
  );

  const updateExplorerUrl = useCallback(
    (newUrl: string) => {
      if (!isUrlValid(newUrl)) {
        toast.error(t('Invalid URL'));
        return;
      }

      updateAvalancheDevnetMode({ explorerUrl: newUrl })
        .then(() => {
          toast.success(t('Devnet explorer URL updated'));
        })
        .catch(() => {
          toast.error(t('Failed to update devnet explorer URL'));
        });
    },
    [updateAvalancheDevnetMode, t],
  );

  return (
    <Stack width={1}>
      <SwitchCard
        title={t('Avalanche devnet mode')}
        description={t(
          'When enabled, Extension will use your configured devnet instead of Avalanche Fuji while testnet mode is enabled.',
        )}
        orientation="horizontal"
        titleSize="large"
        checked={isDeveloperMode && avalancheDevnetMode.enabled}
        disabled={!isDeveloperMode}
        onChange={async () => {
          const toastId = 'avalanche-devnet-mode-switch';
          const nextState = !avalancheDevnetMode.enabled;
          try {
            await updateAvalancheDevnetMode({ enabled: nextState });

            const message = nextState
              ? t('The avalanche devnet mode is on')
              : t('The avalanche devnet mode is off');
            toast.success(message, { id: toastId });
          } catch {
            const message = nextState
              ? t('Failed to enable the avalanche devnet mode')
              : t('Failed to disable the avalanche devnet mode');
            toast.error(message, { id: toastId });
          }
        }}
      >
        <Stack gap={2} width="100%" px={1} py={1}>
          <TextField
            size="small"
            label={t('Devnet RPC URL')}
            defaultValue={avalancheDevnetMode.rpcUrl}
            placeholder="http://localhost:9650"
            onBlur={(e) => {
              if (e.target.value !== avalancheDevnetMode.rpcUrl) {
                updateRpcUrl(e.target.value);
              }
            }}
          />
          <TextField
            size="small"
            label={t('Devnet Explorer URL')}
            defaultValue={avalancheDevnetMode.explorerUrl}
            placeholder="https://subnets.avax-dev.network/"
            helperText={t(
              'Base URL only, "/p-chain" or "/x-chain" suffix will be added automatically.',
            )}
            onBlur={(e) => {
              if (e.target.value !== avalancheDevnetMode.explorerUrl) {
                updateExplorerUrl(e.target.value);
              }
            }}
          />
        </Stack>
      </SwitchCard>
    </Stack>
  );
};

const AvalancheDevnetModeCardGate: FC = () => {
  const { isDeveloperMode } = useNetworkContext();

  if (isProductionBuild()) {
    return null;
  }

  return (
    <Collapse in={isDeveloperMode} sx={{ width: '100%' }}>
      <AvalancheDevnetModeCard />
    </Collapse>
  );
};

export { AvalancheDevnetModeCardGate as AvalancheDevnetModeCard };
