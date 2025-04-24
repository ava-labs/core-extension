import {
  Stack,
  Typography,
  ShieldLockIcon,
  LedgerIcon,
  KeystoneIcon,
  ArrowLeftIconV2,
} from '@avalabs/core-k2-components';
import { forwardRef, ForwardedRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@core/service-worker';
import { OnboardingURLs } from '@core/service-worker';
import { Overlay } from 'packages/ui/src/components/common/Overlay';
import { ExistingWalletButton } from './ExistingWalletButton';

type ExistingWalletOptionsProps = {
  setShowExistingWalletOption: (open: boolean) => void;
};

export const ExistingWalletOptions = forwardRef(function ExistingWalletOptions(
  { setShowExistingWalletOption }: ExistingWalletOptionsProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const history = useHistory();
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();

  return (
    <Overlay
      sx={{
        backgroundColor: 'rgba(17, 17, 17, 0.75)',
      }}
    >
      <Stack
        ref={ref}
        sx={{
          width: 480,
          alignItems: 'flex-start',
          rowGap: 5,
          position: 'fixed',
          top: 90,
        }}
      >
        <ArrowLeftIconV2
          sx={{ cursor: 'pointer', width: 19, height: 14 }}
          onClick={() => {
            setShowExistingWalletOption(false);
          }}
        />
        <Typography variant="h3" sx={{ textAlign: 'left' }}>
          {t('How would you like to access your existing wallet?')}
        </Typography>
        <Stack>
          <Stack sx={{ flexDirection: 'row', columnGap: 3, pb: 3 }}>
            <ExistingWalletButton
              data-testid="access-with-seed-phrase"
              icon={<ShieldLockIcon size={30} />}
              text={t('Enter recovery phrase')}
              onClick={() => {
                history.push(OnboardingURLs.SEED_PHRASE);
              }}
            />
            <ExistingWalletButton
              data-testid="access-with-ledger"
              icon={<LedgerIcon size={30} />}
              text={t('Add using Ledger')}
              onClick={() => {
                history.push(OnboardingURLs.LEDGER);
              }}
            />
          </Stack>
          {featureFlags[FeatureGates.KEYSTONE] && (
            <Stack sx={{ flexDirection: 'row' }}>
              <ExistingWalletButton
                data-testid="access-with-seed-keystone"
                icon={<KeystoneIcon size={30} />}
                text={t('Add using Keystone')}
                onClick={() => {
                  history.push(OnboardingURLs.KEYSTONE);
                }}
              />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Overlay>
  );
});
