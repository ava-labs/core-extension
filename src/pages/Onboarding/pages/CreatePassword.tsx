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
  CheckIcon,
  Checkbox,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  XIcon,
  useTheme,
} from '@avalabs/core-k2-components';
import { PageNav } from '../components/PageNav';
import { PasswordStrength } from '@src/components/common/PasswordStrength';
import { useHistory } from 'react-router-dom';
import { TypographyLink } from '../components/TypographyLink';

import { VerifyGoBackModal } from './Seedless/modals/VerifyGoBackModal';
import { WalletType } from '@avalabs/types';
import Joi from 'joi';
import { isNewsletterConfigured } from '@src/utils/newsletter';

enum EmailValidationResult {
  Undetermined,
  Valid,
  Invalid,
}

const validateEmail = (email: string) => {
  const { error } = Joi.string().email().validate(email);

  return error ? EmailValidationResult.Invalid : EmailValidationResult.Valid;
};

export const CreatePassword = () => {
  const { capture } = useAnalyticsContext();
  const history = useHistory();
  const {
    setPasswordAndNames,
    onboardingPhase,
    isNewsletterEnabled,
    setIsNewsletterEnabled,
    newsletterEmail,
    setNewsletterEmail,
    onboardingWalletType,
  } = useOnboardingContext();
  const [walletName, setWalletName] = useState<string>();
  const [password, setPassword] = useState<string>('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState<string>('');
  const [termAndPolicyChecked, setTermAndPolicyChecked] =
    useState<boolean>(false);

  const [isPasswordInputFilled, setIsPasswordInputFilled] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const [newPasswordStrength, setNewPasswordStrength] = useState<number>(0);
  const [isVerifyGoBackModalOpen, setIsVerifyGoBackModalOpen] = useState(false);

  const [emailValidationResult, setEmailValidationResult] = useState(
    onboardingWalletType === WalletType.Seedless
      ? EmailValidationResult.Valid
      : newsletterEmail
        ? validateEmail(newsletterEmail)
        : EmailValidationResult.Undetermined,
  );

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
    newPasswordStrength > 1 &&
    (!isNewsletterEnabled ||
      emailValidationResult === EmailValidationResult.Valid);

  return (
    <Stack
      sx={{
        width: 375,
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="name-and-password"
        title={t('Account Details')}
      />
      <Stack sx={{ flexGrow: 1, mb: 3, px: 1.5 }}>
        <Stack sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{ mb: 4 }}
            color={theme.palette.text.secondary}
          >
            <Trans i18nKey="For your security, please create a name and password." />
          </Typography>
        </Stack>

        <Stack sx={{ alignSelf: 'center', rowGap: 2, width: 1 }}>
          <Stack>
            <TextField
              size="small"
              data-testid="wallet-name-input"
              label={t('Wallet Name')}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder={t('Enter a Name')}
              autoFocus
              fullWidth
              inputLabelProps={{
                sx: {
                  transform: 'none',
                  fontSize: theme.typography.body2.fontSize,
                  pb: 0.5,
                },
              }}
            />
          </Stack>
          <Stack sx={{ minHeight: theme.spacing(10) }}>
            <TextField
              size="small"
              data-testid="wallet-password-input"
              type="password"
              label={t('Password')}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('Enter a Password')}
              error={!!passwordLengthError}
              helperText={
                password ? '' : t('Password must be 8 characters minimum')
              }
              onBlur={() => {
                setIsPasswordInputFilled(true);
              }}
              inputLabelProps={{
                sx: {
                  transform: 'none',
                  fontSize: theme.typography.body2.fontSize,
                  pb: 0.5,
                },
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
          <Stack sx={{ minHeight: theme.spacing(10) }}>
            <TextField
              size="small"
              type="password"
              data-testid="wallet-confirm-password-input"
              label={t('Confirm Password')}
              onChange={(e) => setConfirmPasswordVal(e.target.value)}
              placeholder={t('Confirm Password')}
              error={confirmationError}
              helperText={
                confirmationError ? t('Passwords do not match') : undefined
              }
              inputLabelProps={{
                sx: {
                  transform: 'none',
                  fontSize: theme.typography.body2.fontSize,
                  pb: 0.5,
                },
              }}
              fullWidth
            />
          </Stack>
        </Stack>

        <Stack sx={{ justifyContent: 'center', mt: 2 }}>
          <Stack>
            <Checkbox
              disableRipple
              size="small"
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
                    i18nKey="I have read and agree to the <termLink>Terms of Use</termLink>"
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
                    }}
                  />
                </Typography>
              }
            />
          </Stack>
        </Stack>

        {isNewsletterConfigured() && (
          <>
            <Divider light sx={{ my: 4, mx: 1.5 }} />

            <Stack sx={{ justifyContent: 'center' }}>
              <Stack sx={{ alignSelf: 'center' }}>
                <Checkbox
                  disableRipple
                  size="small"
                  style={{
                    height: theme.spacing(2.5),
                    color: isNewsletterEnabled
                      ? theme.palette.secondary.main
                      : theme.palette.primary.main,
                  }}
                  sx={{
                    alignSelf: 'flex-start',
                    mt: -0.25,
                  }}
                  data-testid="newsletter-checkbox"
                  checked={isNewsletterEnabled}
                  onChange={() => setIsNewsletterEnabled((enabled) => !enabled)}
                  label={
                    <Typography variant="caption">
                      <Trans
                        i18nKey="Stay updated on latest airdrops, events and more! You can unsubscribe anytime. For more details, see our <privacyLink>Privacy Policy</privacyLink>"
                        components={{
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
            {isNewsletterEnabled &&
              onboardingWalletType !== WalletType.Seedless && (
                <TextField
                  autoFocus
                  sx={{ mt: 1.5 }}
                  size="small"
                  data-testid="newsletter-email-input"
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    setEmailValidationResult(validateEmail(e.target.value));
                  }}
                  value={newsletterEmail}
                  placeholder={t('E-mail address')}
                  error={
                    emailValidationResult === EmailValidationResult.Invalid
                  }
                  helperText={
                    emailValidationResult === EmailValidationResult.Invalid
                      ? t('Please provide a valid e-mail address')
                      : ''
                  }
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {emailValidationResult ===
                          EmailValidationResult.Valid && (
                          <CheckIcon color={theme.palette.success.main} />
                        )}
                        {emailValidationResult ===
                          EmailValidationResult.Invalid && (
                          <XIcon color={theme.palette.error.main} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
          </>
        )}
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
          capture('OnboardingPasswordSet');
          setPasswordAndNames(password, walletName);
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
