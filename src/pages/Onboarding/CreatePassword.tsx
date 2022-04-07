import { useState } from 'react';
import {
  VerticalFlex,
  Input,
  PrimaryButton,
  Typography,
  ComponentSize,
  HorizontalFlex,
  Checkbox,
  InfoIcon,
  Tooltip,
} from '@avalabs/react-components';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { OnboardingPhase } from '@src/background/services/onboarding/models';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { useTheme } from 'styled-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
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
  const { capture, stopDataCollection } = useAnalyticsContext();
  const {
    setPasswordAndName,
    setNextPhase,
    setAnalyticsConsent: saveAnalyticsConsent,
  } = useOnboardingContext();
  const [accountName, setAccountName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState<string>('');
  const [privacyPolicyChecked, setPrivacyPolicyChecked] =
    useState<boolean>(false);
  const [termsOfUseChecked, setTermsOfUseChecked] = useState<boolean>(false);
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(false);

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

  const onSubmit = () => {
    capture('OnboardingPasswordSet', {
      AccountNameSet: !!accountName,
    });

    if (analyticsConsent) {
      capture('OnboardingAnalyticsAccepted');
      saveAnalyticsConsent(true).then(() =>
        setNextPhase(OnboardingPhase.PASSWORD)
      );
    } else {
      capture('OnboardingAnalyticsRejected');
      stopDataCollection();
      saveAnalyticsConsent(false).then(() =>
        setNextPhase(OnboardingPhase.PASSWORD)
      );
    }

    setPasswordAndName(password, accountName).then(() =>
      setNextPhase(
        isImportFlow ? OnboardingPhase.FINALIZE : OnboardingPhase.CREATE_WALLET
      )
    );
  };

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        title="Create a Name and Password"
        onBack={onBack}
        onClose={onCancel}
      />
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 0" size={14} height="17px">
          For your security, please create a new name
          <br />
          and password.
        </Typography>
        <Input
          margin="32px 0 0"
          label="Wallet Name"
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter a Name"
          autoFocus
        />
        <Input
          margin="24px 0"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a Password"
          type="password"
          error={!!passwordLengthError}
          helperText="Must be at least 8 characters"
          onBlur={() => {
            setIsPasswordInputFilled(true);
          }}
          errorMessage={
            passwordLengthError ? 'Must be at least 8 characters' : ''
          }
        />
        <HorizontalFlex width="100%" height="84px">
          <Input
            label="Confirm Password"
            onChange={(e) => setConfirmPasswordVal(e.target.value)}
            placeholder="Enter a Password"
            type="password"
            error={confirmationError}
            errorMessage={
              confirmationError ? 'Passwords do not match' : undefined
            }
          />
        </HorizontalFlex>
        <VerticalFlex justify="flex-start" width="100%">
          <HorizontalFlex margin="8px 0 0">
            <Checkbox
              isChecked={termsOfUseChecked}
              onChange={() => setTermsOfUseChecked(!termsOfUseChecked)}
            />
            <Typography margin="0 0 0 8px" size={12} height="15px">
              I have read and agree to our{' '}
              <Typography
                as="a"
                target="_blank"
                href="https://wallet.avax.network/legal?coreToS"
                color={theme.colors.secondary1}
                size={12}
                height="15px"
                weight={500}
              >
                Terms of Use
              </Typography>
            </Typography>
          </HorizontalFlex>
          <HorizontalFlex margin="8px 0 0">
            <Checkbox
              isChecked={privacyPolicyChecked}
              onChange={() => setPrivacyPolicyChecked(!privacyPolicyChecked)}
            />
            <Typography margin="0 0 0 8px" size={12} height="15px">
              I have read and agree to our{' '}
              <Typography
                as="a"
                target="_blank"
                href="https://wallet.avax.network/legal?core"
                color={theme.colors.secondary1}
                size={12}
                height="15px"
                weight={500}
              >
                Privacy Policy
              </Typography>
            </Typography>
          </HorizontalFlex>
          <HorizontalFlex margin="8px 0 0" align="center">
            <Checkbox
              isChecked={analyticsConsent}
              onChange={() => setAnalyticsConsent(!analyticsConsent)}
            />
            <HorizontalFlex align="center" margin="0 0 0 8px">
              <Typography margin="0 8px 0 0" size={12} height="15px">
                I would like to share data to help improve Core{' '}
              </Typography>
              <Tooltip
                content={
                  <Typography size={12} height="15px">
                    You can opt out at anytime by visting
                    <br />
                    the settings page.
                  </Typography>
                }
              >
                <InfoIcon color={theme.colors.icon1} height="12px" />
              </Tooltip>
            </HorizontalFlex>
          </HorizontalFlex>
        </VerticalFlex>
      </VerticalFlex>
      <PrimaryButton
        size={ComponentSize.LARGE}
        width="343px"
        disabled={!canSubmit}
        onClick={onSubmit}
      >
        Save
      </PrimaryButton>
    </VerticalFlex>
  );
};
