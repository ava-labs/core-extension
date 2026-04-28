import { SwitchCard } from '@/components/SwitchCard';
import { Stack } from '@avalabs/k2-alpine';
import { isProductionBuild } from '@core/common';
import { toast, useNetworkContext, useSettingsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const BridgeDevModeSwitchCard = () => {
  const { isDeveloperMode } = useNetworkContext();
  const { t } = useTranslation();
  const { isBridgeDevEnv, setBridgeDevEnv } = useSettingsContext();

  return (
    <Stack width={1}>
      <SwitchCard
        title={t('Bridge dev mode')}
        description={t(
          'Enable a dev environment for the bridge. Only available in testnet mode.',
        )}
        orientation="horizontal"
        titleSize="large"
        checked={isBridgeDevEnv}
        disabled={!isDeveloperMode}
        onChange={async () => {
          const toastId = 'bridge-dev-mode-switch';
          const nextState = !isBridgeDevEnv;
          try {
            await setBridgeDevEnv(nextState);
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
