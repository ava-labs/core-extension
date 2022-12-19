import { useState } from 'react';
import {
  VerticalFlex,
  PrimaryButton,
  Typography,
  ComponentSize,
  HorizontalFlex,
  WarningIcon,
} from '@avalabs/react-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import styled, { useTheme } from 'styled-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { Trans, useTranslation } from 'react-i18next';
import { PasswordInput } from '@src/components/common/PasswordInput';

const RecoveryPhraseContainer = styled(HorizontalFlex)`
  width: 100%;
  padding: 12px 16px;
  line-height: 1.4em;
  font-size: ${({ theme }) => theme.sizes.textarea[ComponentSize.MEDIUM].font};
  color: ${({ theme }) => theme.inputs.color};
  font-family: ${({ theme }) => theme.fontFamily};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: ${({ theme }) => theme.inputs.border};
  background: ${({ theme }) => theme.inputs.bg};
`;

export function RecoveryPhrase({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [recoveryValue, setRecoveryValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { getUnencryptedMnemonic } = useWalletContext();

  const handleShowRecoveryPhrase = () => {
    getUnencryptedMnemonic(passwordValue)
      .then((res) => {
        setRecoveryValue(res);
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  };

  return (
    <VerticalFlex
      width={width}
      background={theme.colors.bg2}
      height="100%"
      justify="flex-start"
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Show Recovery Phrase')}
      />
      <VerticalFlex
        width="100%"
        height="100%"
        align="center"
        padding="16px 0 0"
      >
        <Typography padding="0 16px" size={14} height="17px" align="center">
          <Trans i18nKey="If you ever change browsers or move computers, you will need this Secret Recovery Phrase to access your accounts. <br /> Save them somewhere safe and secret." />
        </Typography>
        <HorizontalFlex
          margin="24px 0 16px"
          padding="16px 16px"
          align="center"
          background={theme.colors.bg3}
        >
          <WarningIcon height="48px" color={theme.colors.error} />
          <Typography margin="0 0 0 8px" height="20px">
            <Trans i18nKey="DO NOT <br /> share this phrase with anyone! These words can be used to steal all your accounts." />
          </Typography>
        </HorizontalFlex>
        {!recoveryValue ? (
          <>
            <HorizontalFlex height="100px" padding="0 16px" width="100%">
              <PasswordInput
                data-testid="recovery-phrase-password-input"
                label={t('Enter Password to Continue')}
                error={!!errorMessage}
                errorMessage={errorMessage}
                onChange={(e) => {
                  setPasswordValue(e.target.value);
                  setErrorMessage('');
                }}
                value={passwordValue}
                placeholder={t('Password')}
                width="100%"
              />
            </HorizontalFlex>
            <VerticalFlex
              grow="1"
              width="100%"
              padding="0 16px 24px"
              justify="flex-end"
              align="center"
            >
              <PrimaryButton
                data-testid="show-recovery-phrase-button"
                size={ComponentSize.LARGE}
                onClick={handleShowRecoveryPhrase}
                width="100%"
              >
                {t('Show Recovery Phrase')}
              </PrimaryButton>
            </VerticalFlex>
          </>
        ) : (
          <VerticalFlex width="100%" align="center" padding="12px 16px">
            <RecoveryPhraseContainer data-testid="recovery-phrase">
              {recoveryValue}
            </RecoveryPhraseContainer>
          </VerticalFlex>
        )}
      </VerticalFlex>
    </VerticalFlex>
  );
}
