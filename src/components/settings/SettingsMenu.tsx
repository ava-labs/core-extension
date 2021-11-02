import React, { PropsWithChildren } from 'react';
import {
  DropDownMenu,
  HamburgerIcon,
  PrimaryIconButton,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsMenuProps } from './SettingsMenuFlow';

const OuterContainer = styled(VerticalFlex)`
  overflow: hidden;
  height: 504px;
`;

export function SettingsMenu({
  children,
}: PropsWithChildren<SettingsMenuProps>) {
  const theme = useTheme();

  return (
    <DropDownMenu
      coords={{ right: '0px', top: '60px' }}
      icon={
        <PrimaryIconButton>
          <HamburgerIcon color={theme.colors.text1} />
        </PrimaryIconButton>
      }
    >
      <OuterContainer>{children}</OuterContainer>
    </DropDownMenu>
  );
}
