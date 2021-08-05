import React from 'react';
import { HorizontalFlex, Typography } from '@avalabs/react-components';
import { Logo } from '../icons/Logo';
import { useTheme } from 'styled-components';
import { ToggleDarkMode } from './ToggleDarkMode';
import { WalletConnection } from './WalletConnection';

export function Header({ hasOnboarded }: { hasOnboarded: boolean }) {
  const theme = useTheme();
  return (
    <HorizontalFlex
      padding={'10px'}
      justify={'space-between'}
      align={'center'}
      margin={'0 0 5px 0'}
      style={{
        backgroundColor: theme.colors.grey['200'],
      }}
    >
      <HorizontalFlex align={'center'}>
        <Logo />
        <Typography margin={'0 0 0 5px'}>Avvy</Typography>
      </HorizontalFlex>
      {hasOnboarded ? <WalletConnection /> : ''}
      <HorizontalFlex>
        <ToggleDarkMode />
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
