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

export function Currencies({ goBack, navigateTo }: SettingsPageProps) {
  const theme = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  return (
    <VerticalFlex width="375px" padding="12px 0" height="100%">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Currencies'}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {currencies.map((c) => (
          <DropDownMenuItem
            key={c.symbol}
            justify="space-between"
            align="center"
            onClick={() => setSelectedCurrency(c.symbol)}
          >
            <Typography>
              {c.name} ({c.symbol})
            </Typography>
            {selectedCurrency === c.symbol && (
              <CheckmarkIcon size="16px" color={theme.colors.primary[400]} />
            )}
          </DropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
