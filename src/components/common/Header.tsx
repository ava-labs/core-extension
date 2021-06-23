import React from 'react';
import { HorizontalFlex, Typography } from '@avalabs/react-components';
import { Logo } from '../icons/Logo';
import { useTheme } from 'styled-components';

export function Header() {
  const theme = useTheme();
  return (
    <HorizontalFlex
      padding={'10px'}
      margin={'0 0 5px 0'}
      style={{
        backgroundColor: theme.colors.grey['200'],
      }}
    >
      <HorizontalFlex align={'center'}>
        <Logo />
        <Typography margin={'0 0 0 5px'}>Avvy</Typography>
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
