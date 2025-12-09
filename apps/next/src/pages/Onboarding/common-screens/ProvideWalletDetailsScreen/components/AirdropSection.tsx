import { Stack, Switch, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useAnalyticsContext, useOnboardingContext } from '@core/ui';

import {
  Section,
  SectionLabel,
  SectionRow,
} from '@/pages/Onboarding/components/Section';

export const AirdropSection: FC = () => {
  const { t } = useTranslation();
  const { analyticsConsent, setAnalyticsConsent } = useOnboardingContext();
  const { capture, stopDataCollection } = useAnalyticsContext();

  return (
    <Section component="label" sx={{ cursor: 'pointer' }}>
      <SectionRow>
        <Stack gap={0.5}>
          <SectionLabel>{t('Unlock airdrops')}</SectionLabel>
          <Typography variant="caption" color="text.secondary">
            {t(
              'Opt-in for airdrop rewards based on your activity and engagement. Core will collect anonymous interaction data to power this feature.',
            )}
          </Typography>
        </Stack>
        <Stack flexDirection="row" justifyContent="flex-end">
          <Switch
            id="airdrop-switch"
            size="small"
            checked={analyticsConsent}
            onChange={(e) => {
              const isAccepted = e.target.checked;

              if (isAccepted) {
                capture('OnboardingAnalyticsAccepted');
              } else {
                capture('OnboardingAnalyticsRejected');
                stopDataCollection();
              }

              setAnalyticsConsent(isAccepted);
            }}
          />
        </Stack>
      </SectionRow>
    </Section>
  );
};
