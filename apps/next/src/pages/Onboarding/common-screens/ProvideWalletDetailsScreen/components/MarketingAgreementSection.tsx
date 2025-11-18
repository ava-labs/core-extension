import { z } from 'zod';
import {
  Checkbox,
  combineSx,
  Divider,
  Fade,
  Stack,
  StackProps,
  Typography,
} from '@avalabs/k2-alpine';
import { FC, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useAnalyticsContext, useOnboardingContext } from '@core/ui';

import {
  Section,
  SectionLabel,
  SectionRow,
} from '@/pages/Onboarding/components/Section';

import { InTextLink } from '@/components/InTextLink';
import { BorderlessTextField } from '@/components/BorderlessTextField';

type Props = StackProps & {
  onValidityChange: (isValid: boolean) => void;
};

export const MarketingAgreementSection: FC<Props> = ({
  sx,
  onValidityChange,
  ...props
}) => {
  const { t } = useTranslation();
  const {
    isNewsletterEnabled,
    setIsNewsletterEnabled,
    newsletterEmail,
    setNewsletterEmail,
  } = useOnboardingContext();
  const { capture } = useAnalyticsContext();

  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const isValidEmail = validateEmail(newsletterEmail);
  const isValid =
    !isNewsletterEnabled || Boolean(newsletterEmail && isValidEmail);

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  return (
    <Stack sx={combineSx({ gap: 0.5 }, sx)} {...props}>
      <Section divider={false}>
        <SectionRow sx={{ gap: 0.75, cursor: 'pointer' }} component="label">
          <Checkbox
            sx={{ ml: -0.75 }}
            checked={isNewsletterEnabled}
            onChange={(ev) => {
              const isEnabled = ev.target.checked;

              setIsNewsletterEnabled(isEnabled);

              if (isEnabled) {
                capture('OnboardingNewsletterAccepted');
              } else {
                capture('OnboardingNewsletterRejected');
                setNewsletterEmail('');
                setIsEmailTouched(false);
              }
            }}
          />
          <Typography variant="body2" fontSize="14px" lineHeight="16px">
            <Trans
              i18nKey="Stay updated on latest airdrops, events and more! You can unsubscribe anytime. For more details, see our <policyLink>Privacy Policy</policyLink>"
              components={{
                policyLink: (
                  <InTextLink
                    sx={{ ml: 0.25 }}
                    target="_blank"
                    href="https://www.avalabs.org/privacy-policy"
                    rel="noreferrer"
                  />
                ),
              }}
            />
          </Typography>
        </SectionRow>
        {isNewsletterEnabled && (
          <>
            <Divider />
            <Stack sx={{ gap: 0.5 }}>
              <SectionRow component="label">
                <SectionLabel>{t('Email address')}</SectionLabel>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    flexGrow: 1,
                  }}
                >
                  <BorderlessTextField
                    required
                    size="small"
                    placeholder={t('Enter a valid email address')}
                    slotProps={{
                      htmlInput: {
                        sx: { textAlign: 'end', px: 0, py: 0 },
                        'data-testid': 'newsletter-email-input',
                      },
                    }}
                    fullWidth
                    autoFocus
                    value={newsletterEmail}
                    onBlur={() => setIsEmailTouched(true)}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                </Stack>
              </SectionRow>
            </Stack>
          </>
        )}
      </Section>
      <Fade in={isNewsletterEnabled && isEmailTouched && !isValidEmail}>
        <Typography
          variant="caption"
          textAlign="end"
          color="error.light"
          data-testid="newsletter-email-error"
        >
          {newsletterEmail
            ? t('This email looks invalid')
            : t('Enter your email address')}
        </Typography>
      </Fade>
    </Stack>
  );
};

const validateEmail = (email: string) =>
  z.string().email().safeParse(email).success;
