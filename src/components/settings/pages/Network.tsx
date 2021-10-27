import React, { useState } from 'react';
import {
  CheckmarkIcon,
  DropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

// TODO: replace it with the supported currency list and wite it up to the backend
const currencies = [
  { name: 'United States Dollar', symbol: 'USD' },
  { name: 'Euro', symbol: 'EUR' },
  { name: 'Australian Dollar', symbol: 'AUD' },
  { name: 'Canadian Dollar', symbol: 'CAD' },
  { name: 'Swiss Franc', symbol: 'CHF' },
  { name: 'Chilean Peso', symbol: 'CLP' },
  { name: 'Chech Koruna', symbol: 'CZK' },
  { name: 'Danish Krone', symbol: 'DKK' },
  { name: 'British Pound Sterling', symbol: 'GBP' },
  { name: 'Hong Kong Dollar', symbol: 'HKD' },
  { name: 'Hungarian Forint', symbol: 'HUF' },
  { name: 'Israeli New Shekel', symbol: 'ILS' },
  { name: 'Indian Rupee', symbol: 'INR' },
];

export function Network({ goBack, navigateTo }: SettingsPageProps) {
  const theme = useTheme();
  const { network, setNetwork, networks } = useNetworkContext();

  return (
    <VerticalFlex width="375px" background={theme.colors.bg2} height="100%">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Network'}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {networks.map((n) => (
          <DropDownMenuItem
            key={n.name}
            justify="space-between"
            align="center"
            onClick={() => {
              setNetwork(n);
            }}
          >
            <Typography>{n.name}</Typography>
            {network?.name === n.name && (
              <CheckmarkIcon height="16px" color={theme.colors.icon1} />
            )}
          </DropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
