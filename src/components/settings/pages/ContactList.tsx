import React, { useState } from 'react';
import {
  PlusIcon,
  CheckmarkIcon,
  PencilIcon,
  DropDownMenuItem,
  SearchInput,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { truncateAddress } from '@src/utils/truncateAddress';

export function ContactList({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { updateCurrencySetting, currency } = useSettingsContext();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredContacts = [
    {
      name: 'Mike',
      address: '2HbiGU1sbxqGPwcCGpVk7dvnLA9pnQxFARpUAVHHTrntQJMF67',
    },
    {
      name: 'Todd',
      address: '2HbiGU1sbxqGPwcCGpVk7dvnLA9pnQxFARpUAVHHTrntQJMF67',
    },
    {
      name: 'Julia',
      address: '2HbiGU1sbxqGPwcCGpVk7dvnLA9pnQxFARpUAVHHTrntQJMF67',
    },
  ].filter(
    (c) =>
      !searchTerm ||
      c.address.toLowerCase().includes(searchTerm) ||
      c.name.toLowerCase().includes(searchTerm)
  );

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Contact List'}
        action={
          <TextButton margin="0 4px 0 0" onClick={undefined}>
            <PlusIcon height="20px" color={theme.colors.text1} />
          </TextButton>
        }
      />
      <VerticalFlex padding="16px">
        <SearchInput
          placeholder="Search contacts"
          onSearch={setSearchTerm}
          autoFocus={true}
        />
      </VerticalFlex>
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {filteredContacts.map((c) => (
          <DropDownMenuItem
            key={c.address}
            justify="space-between"
            align="center"
            onClick={() => {
              //updateCurrencySetting(c.symbol);
            }}
          >
            <Typography>{c.name}</Typography>

            <Typography>{truncateAddress(c.address, 5)}</Typography>

            <div>
              <PencilIcon height="16px" color={theme.colors.icon1} />
              <CheckmarkIcon height="16px" color={theme.colors.icon1} />
            </div>
          </DropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
