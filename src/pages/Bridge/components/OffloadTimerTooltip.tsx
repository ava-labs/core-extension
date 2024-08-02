import { InfoCircleIcon, Link, Tooltip } from '@avalabs/core-k2-components';
import { Trans, useTranslation } from 'react-i18next';
import { formatDistance } from 'date-fns';

const formatedOffloadDelaySeconds = (
  seconds: number,
  includeSeconds?: boolean
) => {
  return formatDistance(0, seconds * 1000, { includeSeconds });
};

export function OffloadTimerTooltip({
  offloadDelaySeconds,
}: {
  offloadDelaySeconds: number;
}) {
  const { t } = useTranslation();

  const faqLink = (
    <Link
      href="https://support.avax.network/en/articles/6325230-avalanche-bridge-faq-for-converting-btc-to-btc-b"
      target="_blank"
      rel="noreferrer"
      sx={{
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '14px',
      }}
    >
      {t('FAQ')}
    </Link>
  );

  return (
    <Tooltip
      title={
        <Trans
          i18nKey={`Bridging from Avalanche to Bitcoin takes approximately ${formatedOffloadDelaySeconds(
            offloadDelaySeconds,
            true
          )}. Please see
          the <FaqLink>FAQ</FaqLink> for additional info.`}
          components={{ FaqLink: faqLink }}
        />
      }
      PopperProps={{
        sx: {
          maxWidth: '240px',
          m: 1,
        },
      }}
    >
      <InfoCircleIcon />
    </Tooltip>
  );
}
