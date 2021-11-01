import React from 'react';
import {
  BridgeIcon,
  ChecklistIcon,
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

  function setColorWhenActive(url: string) {
    return history.location.pathname === url
      ? theme.colors.primary1
      : theme.palette.grey['300'];
  }
  return (
    <HorizontalFlex
      justify={'space-between'}
      flex={1}
      align={'flex-end'}
      style={{
        position: 'fixed',
        bottom: '0px',
        width: '100%',
        backgroundColor: `${theme.colors.bg1}`,
        height: '80px',
        padding: '19px 48px',
      }}
    >
      <TextButton
        style={{ width: '40px' }}
        onClick={() => history.push('/home')}
      >
        <VerticalFlex>
          <HouseIcon height={'26px'} color={setColorWhenActive('/home')} />
          <br />
          <Typography color={setColorWhenActive('/home')}>Portfolio</Typography>
        </VerticalFlex>
      </TextButton>

      {/* <TextButton
      style={{ width: '40px' }}
      onClick={() => history.push('/watchlist')}
    >
      <VerticalFlex>
        <ChecklistIcon
          height={'26px'}
          color={setColorWhenActive('/watchlist')}
        />
        <br />
        <Typography color={setColorWhenActive('/watchlist')}>
          Watchlist
        </Typography>
      </VerticalFlex>
    </TextButton> */}

      <TextButton
        style={{ width: '40px' }}
        onClick={() => history.push('/activity')}
      >
        <VerticalFlex>
          <LightningIcon
            height={'26px'}
            color={setColorWhenActive('/activity')}
          />
          <br />
          <Typography color={setColorWhenActive('/activity')}>
            Activity
          </Typography>
        </VerticalFlex>
      </TextButton>

      <TextButton style={{ width: '40px' }}>
        <VerticalFlex>
          <SwapArrowsIcon height={'26px'} color={setColorWhenActive('/swap')} />
          <br />
          <Typography color={setColorWhenActive('/swap')}>Swap</Typography>
        </VerticalFlex>
      </TextButton>

      <TextButton style={{ width: '40px' }}>
        <VerticalFlex>
          <BridgeIcon height={'26px'} color={setColorWhenActive('/bridge')} />
          <br />
          <Typography color={setColorWhenActive('/bridge')}>Bridge</Typography>
        </VerticalFlex>
      </TextButton>
    </HorizontalFlex>
  );
}
