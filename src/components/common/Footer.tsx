import React from 'react';
import {
  HorizontalFlex,
  Typography,
  PopoutLinkIcon,
  GearIcon,
  TextButton,
} from '@avalabs/react-components';
import { browser } from 'webextension-polyfill-ts';
import { useTheme } from 'styled-components';
import { Link } from 'react-router-dom';

export function Footer() {
  const theme = useTheme();

  return (
    <HorizontalFlex
      width="100%"
      justify={'space-between'}
      align={'center'}
      padding={'10px'}
      style={{
        backgroundColor: theme.colors.grey['200'],
      }}
    >
      <HorizontalFlex>
        <Typography>Avalabs</Typography>
      </HorizontalFlex>
      <HorizontalFlex>
        <Link to={'/settings'}>
          <GearIcon />
        </Link>
        <TextButton onClick={() => browser.tabs.create({ url: '/popup.html' })}>
          <PopoutLinkIcon />
        </TextButton>
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
