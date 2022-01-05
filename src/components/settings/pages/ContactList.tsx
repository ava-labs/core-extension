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
  Tooltip,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps, SettingsPages } from '../models';
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
  //width: 100%;

  & > ${Typography} {
    word-break: break-all;
  }
`;

const MaxWidthTypography = styled(Typography)`
  max-width: 68px;
  overflow: hidden;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export function ContactList({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { contacts, deleteContact, setEditedContact } = useContactsContext();
  const [searchTerm, setSearchTerm] = useState<string>('');

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
          <Tooltip content={<Typography size={14}>Add New Contact</Typography>}>
            <TextButton
              margin="0 4px 0 0"
              onClick={() => navigateTo(SettingsPages.ADD_CONTACT)}
            >
              <PlusIcon height="20px" color={theme.colors.text1} />
            </TextButton>
          </Tooltip>
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
          >
            <MaxWidthTypography title={c.name}>{c.name}</MaxWidthTypography>

            <AddressBlock
              onClick={() => {
                navigator.clipboard.writeText(c.address);
                toast.success('Copied!');
              }}
            >
              <Typography title={c.address} margin="0px 8px 0px 0px">
                {truncateAddress(c.address, 5)}
              </Typography>
              <CopyIcon height="16px" color={theme.colors.icon1} />
            </AddressBlock>

            <HorizontalFlex>
              <Tooltip
                content={<Typography size={12}>Edit contact</Typography>}
              >
                <TextButton
                  margin="0 8px 0 0"
                  onClick={() => {
                    setEditedContact(c);
                    navigateTo(SettingsPages.EDIT_CONTACT);
                  }}
                >
                  <PencilIcon height="16px" color={theme.colors.icon1} />
                </TextButton>
              </Tooltip>

              <Tooltip
                content={<Typography size={12}>Remove contact</Typography>}
              >
                <TextButton
                  onClick={() => {
                    deleteContact(c.address);
                    toast.success('Contact removed!');
                  }}
                >
                  <TrashIcon height="16px" color={theme.colors.icon1} />
                </TextButton>
              </Tooltip>
            </HorizontalFlex>
          </DropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
