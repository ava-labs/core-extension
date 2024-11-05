import {
  InfoCircleIcon,
  AvalancheAchromaticIcon,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { Trans, useTranslation } from 'react-i18next';
import { BridgeType } from '@avalabs/bridge-unified';

export const BridgeTypeFootnote = ({
  bridgeType,
}: {
  bridgeType?: BridgeType;
}) => {
  if (bridgeType === BridgeType.CCTP) {
    return <CTTPFootnote />;
  }

  if (bridgeType === BridgeType.ICTT_ERC20_ERC20) {
    return <ICTTFootnote />;
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

const ICTTFootnote = () => {
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0,
      }}
    >
      <Typography variant="caption" fontSize={10}>
        {t('Powered by')}
      </Typography>
      <Stack sx={{ gap: 0.5, flexDirection: 'row', alignItems: 'center' }}>
        <AvalancheAchromaticIcon size={20} sx={{ filter: 'invert(1)' }} />
        <Typography variant="caption" fontSize={10}>
          <b>AVALANCHE</b> ICM
        </Typography>

        <Tooltip
          PopperProps={{
            sx: { maxWidth: 188 },
          }}
          title={
            <Trans
              i18nKey="Bridging this token pair utilizes Avalanche Interchain Messaging. <faqLink>Bridge FAQs</faqLink>"
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
    </Stack>
  );
};
