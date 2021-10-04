import {
  CaretIcon,
  DropDownMenu,
  HorizontalFlex,
  IconDirection,
  PrimaryIconButton,
  Typography,
} from '@avalabs/react-components';
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { AccountDropdownContent } from './AccountDopdownContent';

const AccountName = styled(Typography)`
  max-width: 165px;
  margin: 0 16px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 600;
`;

export function AccountSelector() {
  const theme = useTheme();

  return (
    <DropDownMenu
      coords={{
        right: '32px',
        top: '60px',
      }}
      icon={
        <PrimaryIconButton margin="0 32px 0 0">
          <HorizontalFlex align={'center'} padding="0 16px">
            <AccountName>Account</AccountName>
            <CaretIcon
              direction={IconDirection.DOWN}
              color={theme.colors.text}
              height="12px"
            />
          </HorizontalFlex>
        </PrimaryIconButton>
      }
    >
      <AccountDropdownContent />
    </DropDownMenu>
  );
}
