import React from 'react';
import {
  HorizontalFlex,
  Typography,
  PopoutLinkIcon,
  TextButton,
  useGetIsMobileScreenSize,
} from '@avalabs/react-components';
import { browser } from 'webextension-polyfill-ts';
import { useTheme } from 'styled-components';

export function Footer() {
  const { upToLarge, upToExtraSmall } = useGetIsMobileScreenSize();
  const theme = useTheme();

  return (
    <HorizontalFlex
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
        {upToExtraSmall ? (
          <TextButton
            onClick={() => browser.tabs.create({ url: '/popup.html' })}
          >
            <PopoutLinkIcon />
          </TextButton>
        ) : (
          ''
        )}
      </HorizontalFlex>
    </HorizontalFlex>
  );
}
