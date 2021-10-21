import {
  BridgeIcon,
  ChecklistIcon,
  HorizontalFlex,
  HouseIcon,
  LightningIcon,
  PrimaryIconButton,
  SwapArrowsIcon,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import { useHistory } from 'react-router';
import { useTheme } from 'styled-components';
import { WalletPortfolio } from '../Wallet/WalletPortfolio';

export function HomeMiniMode() {
  const history = useHistory();
  const theme = useTheme();

  function setColorWhenActive(url: string) {
    return history.location.pathname === url
      ? theme.colors.primary1
      : theme.palette.grey['300'];
  }

  return (
    <VerticalFlex width={'100%'}>
      <VerticalFlex flex={1}>
        <WalletPortfolio />
      </VerticalFlex>

      <HorizontalFlex justify={'space-between'}>
        <PrimaryIconButton>
          <VerticalFlex>
            <HouseIcon height={'26px'} color={setColorWhenActive('/home')} />
            <br />
            <Typography color={setColorWhenActive('/home')}>
              Portfolio
            </Typography>
          </VerticalFlex>
        </PrimaryIconButton>

        <PrimaryIconButton>
          <VerticalFlex>
            <ChecklistIcon height={'26px'} color={'#CCC'} />
            <br />
            Watchlist
          </VerticalFlex>
        </PrimaryIconButton>

        <PrimaryIconButton>
          <VerticalFlex>
            <LightningIcon height={'26px'} color={'#CCC'} />
            <br />
            Activity
          </VerticalFlex>
        </PrimaryIconButton>

        <PrimaryIconButton>
          <VerticalFlex>
            <SwapArrowsIcon height={'26px'} color={'#CCC'} />
            <br />
            Swap
          </VerticalFlex>
        </PrimaryIconButton>

        <PrimaryIconButton>
          <VerticalFlex>
            <BridgeIcon height={'26px'} color={'#CCC'} />
            <br />
            Bridge
          </VerticalFlex>
        </PrimaryIconButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
