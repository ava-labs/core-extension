import { useState } from 'react';
import {
  VerticalFlex,
  Input,
  PrimaryButton,
  Typography,
  ComponentSize,
  HorizontalFlex,
  Checkbox,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { useTheme } from 'styled-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
interface CreatePasswordProps {
  onCancel(): void;
  onBack(): void;
  isImportFlow: boolean;
}

export const CreatePassword = ({
  onCancel,
  onBack,
  isImportFlow,
}: CreatePasswordProps) => {
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const { setPasswordAndName, setNextPhase } = useOnboardingContext();
  const [accountName, setAccountName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState<string>('');
  const [privacyPolicyChecked, setPrivacyPolicyChecked] =
    useState<boolean>(false);
  const [termsOfUseChecked, setTermsOfUseChecked] = useState<boolean>(false);

  const [isPasswordInputFilled, setIsPasswordInputFilled] = useState(false);

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
    privacyPolicyChecked &&
    termsOfUseChecked;

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        testId="name-and-password"
        title={t('Create a Name and Password')}
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 0" size={14} height="17px">
          <Trans i18nKey="For your security, please create a new name <br />and password." />
        </Typography>
        <Input
          data-testid="wallet-name-input"
          margin="32px 0 0"
          label="Wallet Name"
          onChange={(e) => setAccountName(e.target.value)}
          placeholder={t('Enter a Name')}
          autoFocus
        />
        <Input
          data-testid="wallet-password-input"
          margin="24px 0"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('Enter a Password')}
          type="password"
          error={!!passwordLengthError}
          helperText={t('Must be at least 8 characters')}
          onBlur={() => {
            setIsPasswordInputFilled(true);
          }}
          errorMessage={
            passwordLengthError ? t('Must be at least 8 characters') : ''
          }
        />
        <HorizontalFlex width="100%" height="84px">
          <Input
            data-testid="wallet-confirm-password-input"
            label={t('Confirm Password')}
            onChange={(e) => setConfirmPasswordVal(e.target.value)}
            placeholder={t('Enter a Password')}
            type="password"
            error={confirmationError}
            errorMessage={
              confirmationError ? t('Passwords do not match') : undefined
            }
          />
        </HorizontalFlex>
        <VerticalFlex justify="flex-start" width="100%">
          <HorizontalFlex data-testid="terms-of-use-checkbox" margin="8px 0 0">
            <Checkbox
              isChecked={termsOfUseChecked}
              onChange={() => setTermsOfUseChecked(!termsOfUseChecked)}
            />
            <Typography margin="0 0 0 8px" size={12} height="15px">
              <Trans
                i18nKey="I agree to the <typography>Terms of Use</typography>"
                components={{
                  typography: (
                    <Typography
                      as="a"
                      target="_blank"
                      href="https://wallet.avax.network/legal?core"
                      color={theme.colors.secondary1}
                      size={12}
                      height="15px"
                      weight={500}
                    />
                  ),
                }}
              />
            </Typography>
          </HorizontalFlex>
          <HorizontalFlex
            data-testid="privacy-policy-checkbox"
            margin="8px 0 0"
          >
            <Checkbox
              isChecked={privacyPolicyChecked}
              onChange={() => setPrivacyPolicyChecked(!privacyPolicyChecked)}
            />
            <Typography margin="0 0 0 8px" size={12} height="15px">
              <Trans
                i18nKey="I acknowledge the  <typography>Privacy Policy'</typography>"
                components={{
                  typography: (
                    <Typography
                      as="a"
                      target="_blank"
                      href="https://www.avalabs.org/privacy-policy"
                      color={theme.colors.secondary1}
                      size={12}
                      height="15px"
                      weight={500}
                    />
                  ),
                }}
              />
            </Typography>
          </HorizontalFlex>
        </VerticalFlex>
      </VerticalFlex>
      <PrimaryButton
        data-testid="save-button"
        size={ComponentSize.LARGE}
        width="343px"
        disabled={!canSubmit}
        onClick={() => {
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
      >
        {t('Save')}
      </PrimaryButton>
    </VerticalFlex>
  );
};
