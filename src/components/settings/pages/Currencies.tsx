import { useState } from 'react';
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
import { currencies } from '@avalabs/wallet-react-components';

export function Currencies({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { updateCurrencySetting, currency } = useSettingsContext();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCurrencies = currencies.filter(
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
