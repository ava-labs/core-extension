import { useState, useCallback, useEffect } from 'react';
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
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import {
  KeystoneQRCodeScanner,
  KEYSTONE_CONNECT_SUPPORT_URL,
} from './KeystoneQRCodeScanner';
import { AddressType } from './LedgerConnect';
import { getAddressFromXPub } from '@avalabs/wallets-sdk';
import { useGetAvaxBalance } from '@src/hooks/useGetAvaxBalance';
import { DerivedAddresses } from './components/DerivedAddresses';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';

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

interface KeystoneProps {
  onCancel(): void;
  onNext(): void;
}

const tutorialLastStep = 2; // there are 3 steps to get through the tutorial (the images basically)

export const Keystone = ({ onCancel, onNext }: KeystoneProps) => {
  const { capture } = useAnalyticsContext();
  const { setMasterFingerprint, setXpub } = useOnboardingContext();
  const { t } = useTranslation();
  const theme = useTheme();
  const [stepNumber, setStepNumber] = useState(0);
  const [xPubKey, setXPubKey] = useState('');
  const [isQRCodeScanOpen, setIsQRCodeScanOpen] = useState(false);
  const [addresses, setAddresses] = useState<AddressType[]>([]);

  const { getAvaxBalance } = useGetAvaxBalance();
  const { featureFlags } = useFeatureFlagContext();

  const getAddressFromXpubKey = useCallback(
    async (
      xpub: string,
      accountIndex: number,
      addressList: AddressType[] = []
    ) => {
      const address = getAddressFromXPub(xpub, accountIndex);
      const { balance } = await getAvaxBalance(address);
      const newAddresses = [
        ...addressList,
        { address, balance: balance.balanceDisplayValue || '0' },
      ];
      setAddresses(newAddresses);
      if (accountIndex < 2) {
        await getAddressFromXpubKey(xpub, accountIndex + 1, newAddresses);
      }
      if (accountIndex >= 2) {
        capture('OnboardingKeystoneHasAddresses');
      }
    },
    [capture, getAvaxBalance]
  );

  useEffect(() => {
    if (xPubKey && !addresses.length) {
      getAddressFromXpubKey(xPubKey, 0);
    }
  }, [addresses.length, getAddressFromXpubKey, xPubKey]);

  const steps = 3;

  const headerTitles = [
    t('Connect Software Wallet'),
    t('Connect Network'),
    t('Scan QR Code'),
    t('Confirm Derived Addresses'),
  ];
  const headerDescriptions = [
    t('Tap “Connect Software Wallet” at the bottom left corner.'),
    t('Select the Core wallet.'),
    t(
      'Click on the “Scan” button at the bottom to scan the QR code displayed on the Keystone device.'
    ),
    t('These are the addresses derived from your Keystone device'),
  ];

  const nextButtonLabels = [t('Next'), t('Next'), t('Scan QR Code')];

  function xpubChangeHandler(newValue: string) {
    setXPubKey(newValue);
    setXpub(newValue);
  }

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
    <>
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
          {stepNumber <= tutorialLastStep && (
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
          )}
          {stepNumber === tutorialLastStep + 1 && (
            <Stack sx={{ alignItems: 'center', mt: 3 }}>
              <DerivedAddresses addresses={addresses} />
            </Stack>
          )}
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
            if (stepNumber === tutorialLastStep + 1) {
              onNext();
            }
            if (stepNumber === tutorialLastStep) {
              setIsQRCodeScanOpen(true);
            }
            if (stepNumber + 1 === steps) {
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
              window.open(KEYSTONE_CONNECT_SUPPORT_URL, '_blank');
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
        {isQRCodeScanOpen && (
          <KeystoneQRCodeScanner
            onCancel={() => setIsQRCodeScanOpen(false)}
            setXPubKey={xpubChangeHandler}
            setMasterFingerPrint={setMasterFingerprint}
            onSuccess={() => {
              setIsQRCodeScanOpen(false);
              setStepNumber(stepNumber + 1);
              getAddressFromXpubKey(xPubKey, 0);
            }}
          />
        )}
      </Stack>
    </>
  );
};
