import React, { useState } from 'react';
import {
  CaretIcon,
  CheckmarkIcon,
  DropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  LockIcon,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { resetExtensionState } from '@src/utils/resetExtensionState';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SettingsPageProps } from '../models';

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

export function Currencies({ goBack }: SettingsPageProps) {
  const theme = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  return (
    <VerticalFlex width="375px" padding="12px 0">
      <HorizontalFlex grow="1" padding="12px 24px">
        <TextButton onClick={goBack} margin="0 8px 0 0">
          <CaretIcon
            height="20px"
            direction={IconDirection.LEFT}
            color={theme.colors.text}
          />
        </TextButton>
        <Typography size={18} weight={700} height="24px">
          Currencies
        </Typography>
      </HorizontalFlex>
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
    </VerticalFlex>
  );
}
