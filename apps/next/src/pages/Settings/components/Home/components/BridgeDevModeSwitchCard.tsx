import { SwitchCard } from '@/components/SwitchCard';
import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';
import { Stack, toast } from '@avalabs/k2-alpine';
import { isProductionBuild } from '@core/common';
import { useNetworkContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const BridgeDevModeSwitchCard = () => {
  const { devMode } = useNextUnifiedBridgeContext();
  const { isDeveloperMode } = useNetworkContext();
  const { t } = useTranslation();

  return (
    <Stack width={1}>
      <SwitchCard
        title={t('Bridge dev mode')}
        description={t(
          'Enable a dev environment for the bridge. Only available in testnet mode.',
        )}
        orientation="horizontal"
        titleSize="large"
        checked={devMode.enabled}
        disabled={!isDeveloperMode}
        onChange={async () => {
          const toastId = 'bridge-dev-mode-switch';
          const nextState = !devMode.enabled;
          try {
            await devMode.set(nextState);
            toast.success(
              t('The bridge dev mode is {{mode}}', {
                mode: nextState ? t('on') : t('off'),
              }),
              { id: toastId },
            );
          } catch {
            toast.error(
              t('Failed to switch {{mode}} the bridge dev mode', {
                mode: nextState ? t('on') : t('off'),
              }),
              { id: toastId },
            );
          }
        }}
      />
    </Stack>
  );
};

const BridgeDevModeSwitchCardGate: FC = () => {
  if (isProductionBuild()) {
    return null;
  }

  return <BridgeDevModeSwitchCard />;
};

export { BridgeDevModeSwitchCardGate as BridgeDevModeSwitchCard };
