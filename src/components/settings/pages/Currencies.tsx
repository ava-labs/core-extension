import React, { useState } from 'react';
import {
  CheckmarkIcon,
  DropDownMenuItem,
  SearchInput,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

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
  const { updateCurrencySetting, currency } = useSettingsContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = currencies.filter(
    (c) =>
      !searchTerm ||
      c.symbol.toLowerCase().includes(searchTerm) ||
      c.name.toLowerCase().includes(searchTerm)
  );

  return (
    <VerticalFlex width="375px" background={theme.colors.bg2} height="100%">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Currencies'}
      />
      <VerticalFlex padding="16px">
        <SearchInput
          placeholder="Search"
          onSearch={setSearchTerm}
          autoFocus={true}
        />
      </VerticalFlex>
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {filteredCurrencies.map((c) => (
          <DropDownMenuItem
            key={c.symbol}
            justify="space-between"
            align="center"
            onClick={() => {
              updateCurrencySetting(c.symbol);
            }}
          >
            <Typography>
              {c.name} ({c.symbol})
            </Typography>
            {currency === c.symbol && (
              <CheckmarkIcon height="16px" color={theme.colors.icon1} />
            )}
          </DropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
