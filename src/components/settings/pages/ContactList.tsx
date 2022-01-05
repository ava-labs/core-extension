import React, { useState } from 'react';
import {
  PlusIcon,
  CopyIcon,
  PencilIcon,
  DropDownMenuItem,
  SearchInput,
  TextButton,
  toast,
  TrashIcon,
  Typography,
  VerticalFlex,
  HorizontalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { truncateAddress } from '@src/utils/truncateAddress';

const AddressBlock = styled(HorizontalFlex)`
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 0px 12px;
  border: solid 1px ${({ theme }) => theme.colors.stroke1};
  width: 100%;

  & > ${Typography} {
    word-break: break-all;
  }
`;

export function ContactList({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { contacts } = useContactsContext();
  const [searchTerm, setSearchTerm] = useState<string>('');

  console.log('---');
  console.log(contacts);

  const filteredContacts = contacts
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) // sort alphabetically
    .filter(
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

            <AddressBlock
              onClick={() => {
                navigator.clipboard.writeText(c.address);
                toast.success('Copied!');
              }}
            >
              <Typography>{truncateAddress(c.address, 5)}</Typography>
              <CopyIcon height="16px" color={theme.colors.icon1} />
            </AddressBlock>

            <HorizontalFlex>
              <TextButton margin="0 8px 0 0" onClick={undefined}>
                <PencilIcon height="16px" color={theme.colors.icon1} />
              </TextButton>

              <TextButton onClick={undefined}>
                <TrashIcon height="16px" color={theme.colors.icon1} />
              </TextButton>
            </HorizontalFlex>
          </DropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
