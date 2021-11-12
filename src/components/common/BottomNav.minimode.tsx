import React from 'react';
import {
  BridgeIcon,
  SwapArrowsIcon,
  HorizontalFlex,
  HouseIcon,
  LightningIcon,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useHistory } from 'react-router';
import { useTheme } from 'styled-components';

export function BottomNav() {
  const history = useHistory();
  const theme = useTheme();

  function setColorWhenActive(url: string, isDisabled = false) {
    if (isDisabled) return theme.colors.disabled;

    return history.location.pathname === url
      ? theme.colors.primary1
      : theme.colors.icon2;
  }

  return (
    <HorizontalFlex
      background={theme.colors.bg4}
      position="fixed"
      height="65px"
      width="100%"
      justify="space-between"
      flex={1}
      align="center"
      padding="0 34px"
      style={{
        bottom: '0px',
      }}
    >
      <TextButton onClick={() => history.push('/home')}>
        <VerticalFlex width="50px" align="center">
          <HouseIcon height={'26px'} color={setColorWhenActive('/home')} />
          <Typography
            size={12}
            margin="8px 0 0"
            color={setColorWhenActive('/home')}
          >
            Portfolio
          </Typography>
        </VerticalFlex>
      </TextButton>

      <TextButton onClick={() => history.push('/activity')}>
        <VerticalFlex width="50px" align="center">
          <LightningIcon
            height={'26px'}
            color={setColorWhenActive('/activity')}
          />
          <Typography
            size={12}
            margin="8px 0 0"
            color={setColorWhenActive('/activity')}
          >
            Activity
          </Typography>
        </VerticalFlex>
      </TextButton>

      <TextButton onClick={() => history.push('/swap')}>
        <VerticalFlex width="50px" align="center">
          <SwapArrowsIcon height={'26px'} color={setColorWhenActive('/swap')} />
          <Typography
            size={12}
            margin="8px 0 0"
            color={setColorWhenActive('/swap')}
          >
            Swap
          </Typography>
        </VerticalFlex>
      </TextButton>

      <TextButton
        title="coming soon"
        disabled={true}
        onClick={() => history.push('/bridge')}
      >
        <VerticalFlex width="50px" align="center">
          <BridgeIcon
            height={'26px'}
            color={setColorWhenActive('/bridge', true)}
          />
          <Typography
            size={12}
            margin="8px 0 0"
            color={setColorWhenActive('/bridge', true)}
          >
            Bridge
          </Typography>
        </VerticalFlex>
      </TextButton>
    </HorizontalFlex>
  );
}
