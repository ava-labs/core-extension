import {
  ComponentSize,
  HorizontalFlex,
  HorizontalSeparator,
  Input,
  LoadingSpinnerIcon,
  PrimaryButton,
  TextButton,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BetaLabel } from '@src/components/icons/BetaLabel';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import animationData from '@src/images/OwlAnimation-short.json';
import Lottie from 'react-lottie';
import { ResetExtensionStateHandler } from '@src/background/services/storage/handlers/resetExtensionState';

const StyledLoading = styled(LoadingSpinnerIcon)`
  margin-right: 10px;
`;

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: animationData,
};

export function WalletLocked({
  unlockWallet,
}: {
  unlockWallet(password: string): Promise<any>;
}) {
  const { request } = useConnectionContext();
  const dimensions = useAppDimensions();
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const { showDialog, clearDialog } = useDialog();
  const theme = useTheme();

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onImportClick = () => {
    showDialog({
      title: 'Have you Written Down your Recovery Phrase?',
      body: 'Pressing yes will terminate this session, without your phrase you will not be able to access the current wallet',
      confirmText: 'Yes',
      width: '343px',
      onConfirm: () => {
        clearDialog();
        request<ResetExtensionStateHandler>({
          method: ExtensionRequest.RESET_EXTENSION_STATE,
          params: [true],
        });
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
          isMounted.current && setLoginSuccess(true);
        })
        .catch(() => {
          if (!isMounted.current) return;
          // error!
          setLoggingIn(false);
          setError('Invalid password');
        });
  };

  return (
    <VerticalFlex
      padding="0px 16px 24px"
      align={'center'}
      justify={'center'}
      {...dimensions}
    >
      <VerticalFlex grow="1" justify="center" align="center">
        <Lottie options={defaultOptions} height={260} width={260} />
        <HorizontalFlex justify="flex-end" width="100%">
          <BetaLabel />
        </HorizontalFlex>
      </VerticalFlex>

      <VerticalFlex align="center" height="88px">
        <Input
          data-testid="wallet-locked-password-input"
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
        data-testid="wallet-locked-login-button"
        size={ComponentSize.LARGE}
        width="100%"
        disabled={!password || loggingIn || loginSuccess}
        onClick={handleSubmit}
      >
        {(loggingIn || loginSuccess) && (
          <StyledLoading height="16px" color={theme.colors.stroke2} />
        )}
        Login
      </PrimaryButton>
      <HorizontalSeparator margin="24px 0 8px" />
      <TextButton data-testid="wallet-locked-reset-phrase-button" height="40px" onClick={() => onImportClick()}>
        Reset Secret Recovery Phrase
      </TextButton>
    </VerticalFlex>
  );
}
