import { FeatureGates } from '@avalabs/posthog-sdk';
import { Dialog, Overlay } from '@avalabs/react-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function WalletMaintenance() {
  const { flags } = useAnalyticsContext();

  if (flags[FeatureGates.EVERYTHING]) {
    return null;
  }

  return (
    <Overlay>
      <Dialog
        title="Sorry"
        body="Sorry, Core is currently unavailable. Please check back later. Thanks."
      />
    </Overlay>
  );
}
