import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { Trans, useTranslation } from 'react-i18next';

import { TypographyLink } from '@/pages/Onboarding/components/TypographyLink';
import { AnalyticsConsent } from '@core/types';
import { useSettingsContext } from '@/contexts/SettingsProvider';
import { useAnalyticsConsentCallbacks } from '@/hooks/useAnalyticsConsentCallbacks';

export const AnalyticsOptInDialog = () => {
  const { t } = useTranslation();
  const { analyticsConsent } = useSettingsContext();
  const { isApproving, isRejecting, onApproval, onRejection } =
    useAnalyticsConsentCallbacks('re-opt-in-dialog');

  if (analyticsConsent !== AnalyticsConsent.Pending) {
    return null;
  }

  return (
    <Dialog
      open
      showCloseIcon={false}
      PaperProps={{ sx: { mx: 2, backgroundColor: 'grey.900' } }}
    >
      <DialogTitle typographyProps={{ variant: 'h5' }} sx={{ px: 2 }}>
        {t('Help Us Improve Core')}
      </DialogTitle>
      <DialogContent sx={{ px: 2, pb: 5 }}>
        <Stack sx={{ gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t(
              'Core would like to gather data using local storage and similar technologies to help us understand how our users interact with Core.',
            )}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <Trans
              i18nKey="This enables us to develop improvements and enhance your experience, to find out more you can read our <typography>Privacy Policy</typography>."
              components={{
                typography: (
                  <TypographyLink
                    as="a"
                    target="_blank"
                    href="https://www.avalabs.org/privacy-policy"
                  />
                ),
              }}
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('You can always opt out by visiting the settings page.')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Trans
              i18nKey="Core will <b>never</b> sell or share data."
              components={{ b: <b /> }}
            />
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2 }}>
        <Button
          size="large"
          color="primary"
          disabled={isApproving || isRejecting}
          isLoading={isApproving}
          fullWidth
          onClick={onApproval}
        >
          {t('I Agree')}
        </Button>
        <Button
          size="large"
          color="secondary"
          disabled={isApproving || isRejecting}
          isLoading={isRejecting}
          fullWidth
          onClick={onRejection}
        >
          {t('No Thanks')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
