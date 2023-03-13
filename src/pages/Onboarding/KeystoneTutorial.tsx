import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  useTheme,
  ExternalLinkIcon,
  Button,
  styled,
} from '@avalabs/k2-components';
import { PageNav } from './components/PageNav';
import { useState } from 'react';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';

const KeystoneStepImage = styled(Stack)`
  position: relative;
  img {
    width: 167px;
    z-index: 1;
  }
`;

const KeystoneImageBackground = styled(Stack)`
  position: absolute;
  width: 242px;
  height: 318px;
  left: 50px;
  top: 0px;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.2)
  );
  filter: blur(77px);
  transform: rotate(-112deg);
  z-index: 0;
`;

interface KeystoneTutorialProps {
  onCancel(): void;
}

export const KeystoneTutorial = ({ onCancel }: KeystoneTutorialProps) => {
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const theme = useTheme();
  const [stepNumber, setStepNumber] = useState(0);
  const { featureFlags } = useFeatureFlagContext();

  const headerTitles = [
    t('Select Software Wallet'),
    t('Connect Network'),
    t('Scan QR Code'),
  ];
  const headerDescriptions = [
    t(
      'Select the “Core Wallet” option in the “Software Wallet” menu available in your Keystone'
    ),
    t('Select “Connect” in the top right corner of your Keystone device'),
    t(
      'Click the button below to scan the QR code displayed on your Keystone device'
    ),
  ];

  const nextButtonLabels = [t('Next'), t('Next'), t('Scan QR Code')];

  if (!featureFlags[FeatureGates.KEYSTONE]) {
    return (
      <Stack
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <OnboardingStepHeader
          title={headerTitles[stepNumber]}
          onClose={onCancel}
        />
        <FunctionIsOffline functionName={t('Keystone')} hidePageTitle />
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="keystone-tutorial-step-1"
        title={headerTitles[stepNumber]}
        onClose={onCancel}
      />
      <Stack
        sx={{
          flexGrow: 1,
          pt: 1,
          px: 6,
        }}
      >
        <Typography variant="body2" minHeight={40}>
          {headerDescriptions[stepNumber]}
        </Typography>
        <KeystoneStepImage
          sx={{
            pt: 5,
            width: theme.spacing(44),
            alignSelf: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={`/images/keystone/keystone_onboarding_step_${
              stepNumber + 1
            }.png`}
          />
          <KeystoneImageBackground />
        </KeystoneStepImage>
      </Stack>
      <PageNav
        onBack={() => {
          if (!stepNumber) {
            onCancel();
            return;
          }
          setStepNumber(stepNumber - 1);
        }}
        onNext={() => {
          if (stepNumber > 1) {
            return;
          }
          capture(`KeystoneTutorialStep${stepNumber + 1}`);
          setStepNumber(stepNumber + 1);
        }}
        disableNext={false}
        expand={true}
        steps={6}
        activeStep={stepNumber}
        nextText={nextButtonLabels[stepNumber]}
      >
        <Button
          variant="text"
          onClick={() => {
            window.open('https://keyst.one', '_blank');
          }}
        >
          <ExternalLinkIcon
            size={16}
            sx={{ color: 'secondary.main', marginRight: 1 }}
          />
          <Typography
            variant="caption"
            sx={{
              color: 'secondary.main',
              fontWeight: 600,
            }}
          >
            {t('Keystone Support')}
          </Typography>
        </Button>
      </PageNav>
    </Stack>
  );
};
