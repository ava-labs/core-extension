import {
  ComponentSize,
  HorizontalSeparator,
  Input,
  LoadingSpinnerIcon,
  PrimaryButton,
  TextButton,
  Typography,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import { LoginIllustration } from '@src/components/common/LoginIllustation';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import { resetExtensionState } from '@src/utils/resetExtensionState';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';

const StyledLoading = styled(LoadingSpinnerIcon)`
  margin-right: 10px;
`;

export function WalletLocked({
  unlockWallet,
}: {
  unlockWallet(password: string): Promise<any>;
}) {
  const dimensions = useAppDimensions();
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const { showDialog, clearDialog } = useDialog();
  const theme = useTheme();

  const onImportClick = () => {
    showDialog({
      title: 'Have you written down your recovery phrase?',
      body: 'Pressing yes will terminate this session, without your phrase you will not be able to access the current wallet',
      confirmText: 'Yes',
      width: '343px',
      onConfirm: () => {
        clearDialog();
        resetExtensionState(true);
      },
      cancelText: 'No',
      onCancel: () => {
        clearDialog();
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    password &&
      unlockWallet(password)
        .then(() => {
          // success!
          setLoginSuccess(true);
        })
        .catch(() => {
          // error!
          setLoggingIn(false);
          setError('Invalid password');
        });
  };

  return (
    <VerticalFlex
      padding="32px 16px 36px"
      align={'center'}
      justify={'center'}
      {...dimensions}
    >
      <Typography size={24} height="29px" weight={700}>
        Welcome Back!
      </Typography>
      <VerticalFlex grow="1" justify="center" align="center">
        <LoginIllustration size={146} />
      </VerticalFlex>

      <VerticalFlex align="center" height="105px">
        <Input
          type="password"
          label="Password"
          onChange={(e) => setPassword(e.currentTarget.value.trim())}
          placeholder="Password"
          error={!!error}
          errorMessage={error}
          onKeyPress={(e) => {
            // When we click the enter key within the password input
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
          autoFocus
        />
      </VerticalFlex>
      <PrimaryButton
        size={ComponentSize.LARGE}
        width="100%"
        disabled={!password || loggingIn || loginSuccess}
        onClick={handleSubmit}
      >
        {(loggingIn || loginSuccess) && (
          <StyledLoading height="24px" color={theme.colors.stroke2} />
        )}
        Login
      </PrimaryButton>
      <HorizontalSeparator margin="24px 0" />
      <TextButton onClick={() => onImportClick()}>
        Import a wallet using recovery phrase
      </TextButton>
    </VerticalFlex>
  );
}
