import { useEffect, useMemo, useState } from 'react';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import {
  OnboardingPhase,
  OnboardingURLs,
} from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from '../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Trans, useTranslation } from 'react-i18next';
import {
  Checkbox,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { PageNav } from '../components/PageNav';
import { PasswordStrength } from '@src/components/common/PasswordStrength';
import { useHistory } from 'react-router-dom';
import { TypographyLink } from '../components/TypographyLink';
import { VerifyGoBackModal } from './Seedless/modals/VerifyGoBackModal';

export const CreatePassword = () => {
  const { capture } = useAnalyticsContext();
  const history = useHistory();
  const { setPasswordAndName, onboardingPhase } = useOnboardingContext();
  const [accountName, setAccountName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState<string>('');
  const [termAndPolicyChecked, setTermAndPolicyChecked] =
    useState<boolean>(false);

  const [isPasswordInputFilled, setIsPasswordInputFilled] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const [newPasswordStrength, setNewPasswordStrength] = useState<number>(0);
  const [isVerifyGoBackModalOpen, setIsVerifyGoBackModalOpen] = useState(false);

  const getSteps = useMemo(() => {
    if (onboardingPhase === OnboardingPhase.IMPORT_WALLET) {
      return { stepsNumber: 3, activeStep: 1 };
    }
    if (onboardingPhase === OnboardingPhase.KEYSTONE) {
      return { stepsNumber: 6, activeStep: 4 };
    }
    if (
      onboardingPhase === OnboardingPhase.SEEDLESS_GOOGLE ||
      onboardingPhase === OnboardingPhase.SEEDLESS_APPLE
    ) {
      return { stepsNumber: 3, activeStep: 1 };
    }
    return { stepsNumber: 4, activeStep: 2 };
  }, [onboardingPhase]);

  useEffect(() => {
    if (!onboardingPhase) {
      history.push(OnboardingURLs.ONBOARDING_HOME);
    }
    capture(OnboardingPhase.PASSWORD);
  }, [capture, history, onboardingPhase]);

  const isFieldsFilled = !!(password && confirmPasswordVal);
  const confirmationError = !!(
    password &&
    confirmPasswordVal &&
    password !== confirmPasswordVal
  );
  const passwordLengthError =
    isPasswordInputFilled && password && password.length < 8;
  const canSubmit =
    !confirmationError &&
    isFieldsFilled &&
    termAndPolicyChecked &&
    newPasswordStrength > 1;

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="name-and-password"
        title={t('Account Details')}
      />
      <Stack sx={{ flexGrow: 1, textAlign: 'center', mb: 3 }}>
        <Typography
          variant="body2"
          sx={{ mb: 4 }}
          color={theme.palette.text.secondary}
        >
          <Trans i18nKey="For your security, please create a name and password." />
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
              fullWidth
            />
            {password && (
              <PasswordStrength
                password={password}
                setPasswordStrength={setNewPasswordStrength}
              />
            )}
          </Stack>
          <Stack sx={{ height: theme.spacing(12) }}>
            <TextField
              type="password"
              data-testid="wallet-confirm-password-input"
              label={t('Confirm Password')}
              onChange={(e) => setConfirmPasswordVal(e.target.value)}
              placeholder={t('Confirm Password')}
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
                <Typography variant="caption">
                  <Trans
                    i18nKey="I agree to the <termLink>Terms of Use</termLink> and the <privacyLink>Privacy Policy</privacyLink>"
                    components={{
                      termLink: (
                        <TypographyLink
                          as="a"
                          target="_blank"
                          href="https://core.app/terms/core"
                          variant="caption"
                          sx={{
                            color: 'secondary.main',
                          }}
                          rel="noreferrer"
                        />
                      ),
                      privacyLink: (
                        <TypographyLink
                          as="a"
                          target="_blank"
                          href="https://www.avalabs.org/privacy-policy"
                          variant="caption"
                          sx={{
                            color: 'secondary.main',
                          }}
                          rel="noreferrer"
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
        onBack={() => {
          capture('OnboardingPasswordCancelled');
          if (onboardingPhase === OnboardingPhase.SEEDLESS_GOOGLE) {
            setIsVerifyGoBackModalOpen(true);
            return;
          }
          history.goBack();
        }}
        onNext={() => {
          capture('OnboardingPasswordSet', {
            AccountNameSet: !!accountName,
          });
          setPasswordAndName(password, accountName);
          history.push(OnboardingURLs.ANALYTICS_CONSENT);
        }}
        nextText={t('Save')}
        disableNext={!canSubmit}
        expand={
          onboardingPhase === OnboardingPhase.CREATE_WALLET ? false : true
        }
        steps={getSteps.stepsNumber}
        activeStep={getSteps.activeStep}
      />
      <VerifyGoBackModal
        isOpen={isVerifyGoBackModalOpen}
        onBack={() => {
          history.push(OnboardingURLs.ONBOARDING_HOME);
          setIsVerifyGoBackModalOpen(false);
        }}
        onCancel={() => {
          setIsVerifyGoBackModalOpen(false);
        }}
      />
    </Stack>
  );
};
