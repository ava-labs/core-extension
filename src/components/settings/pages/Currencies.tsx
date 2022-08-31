import { useState } from 'react';
import {
  CheckmarkIcon,
  SearchInput,
  SecondaryDropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { CURRENCIES } from '@src/background/services/settings/models';

export function Currencies({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { updateCurrencySetting, currency } = useSettingsContext();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      !searchTerm ||
      c.symbol.toLowerCase().includes(searchTerm) ||
      c.name.toLowerCase().includes(searchTerm)
  );

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Currency'}
      />
      <VerticalFlex padding="16px 16px 24px">
        <SearchInput
          data-testid="currency-search-input"
          placeholder="Search"
          onSearch={setSearchTerm}
          autoFocus={true}
        />
      </VerticalFlex>
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {filteredCurrencies.map((c) => (
          <SecondaryDropDownMenuItem
            data-testid={`currency-menu-item-${c.symbol}`.toLowerCase()}
            selected={currency === c.symbol}
            padding="10px 16px"
            key={c.symbol}
            justify="space-between"
            align="center"
            onClick={() => {
              updateCurrencySetting(c.symbol);
            }}
          >
            <Typography size={14} height="17px">
              {c.name} ({c.symbol})
            </Typography>
            {currency === c.symbol && (
              <CheckmarkIcon height="16px" color={theme.colors.icon1} />
            )}
          </SecondaryDropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
