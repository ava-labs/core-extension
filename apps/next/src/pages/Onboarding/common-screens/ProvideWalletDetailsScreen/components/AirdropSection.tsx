import {
  combineSx,
  Stack,
  StackProps,
  Switch,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useOnboardingContext } from '@core/ui';

import {
  Section,
  SectionLabel,
  SectionRow,
} from '@/pages/Onboarding/components/Section';

export const AirdropSection: FC<StackProps> = ({ sx, ...props }) => {
  const { t } = useTranslation();
  const { analyticsConsent, setAnalyticsConsent } = useOnboardingContext();

  return (
    <Stack sx={combineSx({ gap: 1 }, sx)} {...props}>
      <Section component="label" sx={{ cursor: 'pointer' }}>
        <SectionRow>
          <Stack sx={{ gap: 0.5 }}>
            <SectionLabel>{t('Unlock airdrops')}</SectionLabel>
            <Typography variant="caption" color="text.secondary">
              {t(
                'As a Core user, you have the option to opt-in for airdrop rewards based on your activity and engagement. Core will collect anonymous interaction data to power this feature.',
              )}
            </Typography>
          </Stack>
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Switch
              id="airdrop-switch"
              size="small"
              checked={analyticsConsent}
              onChange={(e) => setAnalyticsConsent(e.target.checked)}
            />
          </Stack>
        </SectionRow>
      </Section>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ maxWidth: '75%' }}
      >
        {t(
          'Core is committed to protecting your privacy. We will never sell or share your data. If you wish, you can disable this at any time in the settings menu.',
        )}
      </Typography>
    </Stack>
  );
};
