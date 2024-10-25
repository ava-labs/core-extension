import {
  InfoCircleIcon,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { Trans, useTranslation } from 'react-i18next';
import { BridgeAsset, BridgeType } from '@avalabs/bridge-unified';

import { NetworkWithCaipId } from '@src/background/services/network/models';

export const BridgeTypeFootnote = ({
  asset,
  targetChain,
}: {
  asset: BridgeAsset;
  targetChain: NetworkWithCaipId;
}) => {
  const availableBridges = asset.destinations[targetChain.caipId] ?? [];

  // NOTE: we assume that UnifiedBridge SDK will use the first matching bridge from the `destinations` map
  const isCCTP = availableBridges[0] === BridgeType.CCTP;

  if (isCCTP) {
    return <CTTPFootnote />;
  }

  return null;
};

const CTTPFootnote = () => {
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <Typography variant="caption">{t('Powered by')}</Typography>
      <img src="/images/logos/circle.png" style={{ height: 14 }} alt="Circle" />
      <Tooltip
        PopperProps={{
          sx: { maxWidth: 188 },
        }}
        title={
          <Trans
            i18nKey="USDC is routed through Circle's Cross-Chain Transfer Protocol. <faqLink>Bridge FAQs</faqLink>"
            components={{
              faqLink: (
                <Link
                  href="https://support.avax.network/en/articles/6092559-avalanche-bridge-faq"
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    fontSize: 'caption.fontSize',
                    display: 'inline-flex',
                    color: 'secondary.dark',
                  }}
                />
              ),
            }}
          />
        }
      >
        <InfoCircleIcon sx={{ cursor: 'pointer' }} />
      </Tooltip>
    </Stack>
  );
};
