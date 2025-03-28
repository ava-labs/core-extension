import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { useTranslation } from 'react-i18next';
import {
  Button,
  RemoteIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { useHistory } from 'react-router-dom';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import { LedgerTroubleSteps } from '../../../../components/ledger/LedgerTroublesSteps';
import { LedgerLiveSupportButton } from '@src/components/ledger/LedgerLiveSupportButton';

export function LedgerTrouble() {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();

  return (
    <Stack
      sx={{
        width: '390px',
        height: '100%',
        mt: 4,
      }}
    >
      <OnboardingStepHeader
        testId="ledger-trouble"
        title={t('Trouble Connecting')}
      />
      <Stack
        sx={{
          flexGrow: 1,
          pt: 1,
          textAlign: 'center',
        }}
      >
        <Stack sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t("We're having trouble connecting to your device.")}
          </Typography>
        </Stack>
        <Stack>
          <Stack sx={{ alignItems: 'center', mt: 4, mb: 3 }}>
            <RemoteIcon size={88} />
          </Stack>

          <LedgerTroubleSteps appName={t('Avalanche App')} sx={{ pt: 1.5 }} />
        </Stack>
      </Stack>
      <Stack
        sx={{
          width: '100%',
          justifyItems: 'space-between',
          alignContent: 'center',
          mb: 9,
          rowGap: theme.spacing(2),
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            columnGap: 2,
          }}
        >
          <Button
            color="secondary"
            data-testid="page-nav-back-button"
            onClick={() => {
              history.goBack();
            }}
            sx={{
              width: theme.spacing(21),
            }}
          >
            {t('Back')}
          </Button>
          <Button
            data-testid="page-nav-next-button"
            onClick={() => {
              history.push(OnboardingURLs.ONBOARDING_HOME);
            }}
            sx={{
              width: theme.spacing(21),
            }}
          >
            {t('Cancel')}
          </Button>
        </Stack>
        <Stack sx={{ justifyContent: 'center', flexDirection: 'row' }}>
          <LedgerLiveSupportButton />
        </Stack>
      </Stack>
    </Stack>
  );
}
