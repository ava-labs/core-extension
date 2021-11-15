import {
  ComponentSize,
  Input,
  PrimaryButton,
  TextButton,
  Typography,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import { LoginIllustration } from '@src/components/common/LoginIllustation';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import { resetExtensionState } from '@src/utils/resetExtensionState';
import React, { useState } from 'react';
import styled from 'styled-components';

const IllustrationPlaceholder = styled(VerticalFlex)`
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: ${({ theme }) => theme.palette.grey[800]};
  justify-content: center;
  align-items: center;
`;

export function WalletLocked({
  unlockWallet,
}: {
  unlockWallet(password: string): Promise<any>;
}) {
  const dimensions = useAppDimensions();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { showDialog, clearDialog } = useDialog();

  const onImportClick = () => {
    showDialog({
      title: 'Have you recorded your recovery phrase?',
      body: 'Without it you will not be able to sign back in to your account.',
      confirmText: 'Yes',
      width: '343px',
      onConfirm: () => {
        clearDialog();
        resetExtensionState();
      },
      cancelText: 'No',
      onCancel: () => {
        clearDialog();
      },
    });
  };

  return (
    <VerticalFlex
      padding="32px 16px"
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
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Password"
          error={!!error}
          errorMessage={error}
          autoFocus
        />
      </VerticalFlex>
      <PrimaryButton
        size={ComponentSize.LARGE}
        width="100%"
        margin="0 0 24px 0"
        disabled={!password}
        onClick={() =>
          password &&
          unlockWallet(password).catch(() => {
            setError('Invalid password');
          })
        }
      >
        Login
      </PrimaryButton>
      <TextButton onClick={() => onImportClick()}>
        or login with your recovery phrase
      </TextButton>
    </VerticalFlex>
  );
}
