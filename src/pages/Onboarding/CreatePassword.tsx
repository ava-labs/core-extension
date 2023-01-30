import { useState } from 'react';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Trans, useTranslation } from 'react-i18next';
import {
  Checkbox,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { OnboardingPath } from './Onboarding';
import { PageNav } from './components/PageNav';
interface CreatePasswordProps {
  onCancel(): void;
  onBack(): void;
  isImportFlow: boolean;
  onboardingPath?: OnboardingPath;
}

export const CreatePassword = ({
  onCancel,
  onBack,
  isImportFlow,
  onboardingPath,
}: CreatePasswordProps) => {
  const { capture } = useAnalyticsContext();
  const { setPasswordAndName, setNextPhase } = useOnboardingContext();
  const [accountName, setAccountName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState<string>('');
  const [termAndPolicyChecked, setTermAndPolicyChecked] =
    useState<boolean>(false);

  const [isPasswordInputFilled, setIsPasswordInputFilled] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  const isFieldsFilled = !!(password && confirmPasswordVal);
  const confirmationError = !!(
    password &&
    confirmPasswordVal &&
    password !== confirmPasswordVal
  );
  const passwordLengthError =
    isPasswordInputFilled && password && password.length < 8;
  const canSubmit =
    !passwordLengthError &&
    !confirmationError &&
    isFieldsFilled &&
    termAndPolicyChecked;

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="name-and-password"
        title={t('Create a Name and Password')}
        onClose={onCancel}
      />
      <Stack sx={{ flexGrow: 1, pt: 1, px: 6 }}>
        <Typography variant="body2" sx={{ mb: 4 }}>
          <Trans i18nKey="For your security, please create a new name and password." />
        </Typography>

        <Stack
          sx={{ width: theme.spacing(44), alignSelf: 'center', rowGap: 2 }}
        >
          <Stack sx={{ height: theme.spacing(12) }}>
            <TextField
              data-testid="wallet-name-input"
              label={t('Wallet Name')}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder={t('Enter a Name')}
              autoFocus
              fullWidth
            />
          </Stack>
          <Stack sx={{ height: theme.spacing(12) }}>
            <TextField
              data-testid="wallet-password-input"
              type="password"
              label={t('Password')}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('Enter a Password')}
              error={!!passwordLengthError}
              onBlur={() => {
                setIsPasswordInputFilled(true);
              }}
              helperText={
                passwordLengthError ? t('Must be at least 8 characters') : ''
              }
              fullWidth
            />
          </Stack>
          <Stack sx={{ height: theme.spacing(12) }}>
            <TextField
              type="password"
              data-testid="wallet-confirm-password-input"
              label={t('Confirm Password')}
              onChange={(e) => setConfirmPasswordVal(e.target.value)}
              placeholder={t('Enter a Password')}
              error={confirmationError}
              helperText={
                confirmationError ? t('Passwords do not match') : undefined
              }
              fullWidth
            />
          </Stack>
        </Stack>

        <Stack sx={{ justifyContent: 'center', mt: 2 }}>
          <Stack sx={{ alignSelf: 'center', width: theme.spacing(44) }}>
            <Checkbox
              disableRipple
              style={{
                height: theme.spacing(2.5),
                color: termAndPolicyChecked
                  ? theme.palette.secondary.main
                  : theme.palette.primary.main,
              }}
              data-testid="terms-of-use-checkbox"
              checked={termAndPolicyChecked}
              onChange={() => setTermAndPolicyChecked(!termAndPolicyChecked)}
              label={
                <Typography variant="body3">
                  <Trans
                    i18nKey="I agree to the <termLink>Terms of Use</termLink> and the <privacyLink>Privacy Policy</privacyLink>"
                    components={{
                      termLink: (
                        <Typography
                          as="a"
                          target="_blank"
                          href="https://core.app/terms/core"
                          variant="body3"
                          sx={{
                            color: 'secondary.main',
                          }}
                        />
                      ),
                      privacyLink: (
                        <Typography
                          as="a"
                          target="_blank"
                          href="https://www.avalabs.org/privacy-policy"
                          variant="body3"
                          sx={{
                            color: 'secondary.main',
                          }}
                        />
                      ),
                    }}
                  />
                </Typography>
              }
            />
          </Stack>
        </Stack>
      </Stack>
      <PageNav
        onBack={onBack}
        onNext={() => {
          capture('OnboardingPasswordSet', {
            AccountNameSet: !!accountName,
          });
          setPasswordAndName(password, accountName);
          setNextPhase(
            isImportFlow
              ? OnboardingPhase.FINALIZE
              : OnboardingPhase.CREATE_WALLET
          );
        }}
        nextText={
          onboardingPath === OnboardingPath.NEW_WALLET ? t('Next') : t('Save')
        }
        disableNext={!canSubmit}
        expand={onboardingPath === OnboardingPath.NEW_WALLET ? false : true}
        steps={onboardingPath === OnboardingPath.NEW_WALLET ? 4 : 3}
        activeStep={onboardingPath === OnboardingPath.NEW_WALLET ? 1 : 2}
      />
    </Stack>
  );
};
