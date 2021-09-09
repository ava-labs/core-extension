import {
  HorizontalFlex,
  VerticalFlex,
  TextButton,
  Typography,
  useIsSmallScreen,
  CaretIcon,
  Card,
} from '@avalabs/react-components';
import styled, { css, useTheme } from 'styled-components';
import React, { useState } from 'react';
import { MenuItem, menuItems } from './MenuItems';
import { NavLink } from 'react-router-dom';

const Link = styled(TextButton)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 8px 0;
    border-radius: ${theme.borderRadius};
  `};

  ${(props: { highlighted?: boolean; level?: number }) =>
    css`
      width: 100%;
      border-radius: 0;

      &:hover {
        background-color: ${({ theme }) =>
          props.level === 1 ? theme.colors.grey[800] : 'transparent'};
        text-shadow: 0px 0px 1px ${({ theme }) => theme.colors.text};
      }

      ${({ theme }) => theme.mediaWidth.upToSmall`
        background: ${
          props.highlighted ? theme.colors.grey[800] : 'transparent'
        };
        padding: ${props.level === 0 ? '16px 8px' : '8px'};
        justify-content: flex-start;
      `};
    `};
`;

const DropDownContent = styled(Card)`
  display: none;
  position: absolute;
  align-items: flex-start;
  overflow: hidden;
  padding: 0;
  flex-direction: column;
  width: fit-content;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    background: none;
    width: 100%;
    padding: 0 0 0 44px;
    position: relative;
  `};
`;

// wrap Caret so that it can be referred in the css
const StyledCaretIcon = styled(CaretIcon)`
  transform: rotate(0);
  transition: transform 0.3s;

  ${({ theme }) => theme.mediaWidth.upToSmall`
      transform: rotate(-90deg);
    `};
`;

const DropDown = styled.div<{
  open?: boolean;
  isMobile: boolean;
}>`
  position: relative;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    filter: none;
 
    &:hover > ${DropDownContent} {
      display: inital;
    }
  `};

  ${({ isMobile, open }) =>
    isMobile
      ? open &&
        css`
          & > ${DropDownContent} {
            display: flex;
          }

          & > ${DropDownText} {
            background: ${({ theme }) => theme.colors.grey[800]};
          }

          & ${StyledCaretIcon} {
            transform: rotate(0);
          }
        `
      : css`
          &:hover > ${DropDownContent} {
            display: flex;
          }
          &:hover ${StyledCaretIcon} {
            transform: rotate(-180deg);
          }
          &:hover > ${Typography} {
            text-shadow: 0px 0px 1px ${({ theme }) => theme.colors.text};
          }
        `};
`;

const DropDownText = styled(Typography)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 0 5px 40px;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    padding: 16px 4px 16px 8px;
    justify-content: space-between;
    margin: 8px 0;
    border-radius: ${theme.borderRadius};
  `};
`;

function Menu() {
  const theme = useTheme();
  const isSmallScreen = useIsSmallScreen();
  const [dropDownOpen, setDropDownOpen] = useState('');

  const toggleDropDown = (key: string) => {
    if (!isSmallScreen) return;

    if (dropDownOpen === key) {
      setDropDownOpen('');
    } else {
      setDropDownOpen(key);
    }
  };

  const renderMenuItems = (menuItems: MenuItem[], level = 0) => {
    const elements: JSX.Element[] = [];

    const margin = level === 0 ? '5px 0 5px 40px' : '0';
    const paddingDefault = level === 0 ? '0' : '12px 32px';
    const paddingFirst = level === 0 ? '0' : '24px 32px 12px';
    const paddingLast = level === 0 ? '0' : '12px 32px 24px';

    for (let i = 0; i < menuItems.length; i++) {
      let padding;
      if (i === 0) {
        padding = paddingFirst;
      } else if (i === menuItems.length - 1) {
        padding = paddingLast;
      } else {
        padding = paddingDefault;
      }

      const item = menuItems[i];
      if (item.href) {
        elements.push(
          <Link
            level={level}
            highlighted={item.highlighted}
            as="a"
            margin={margin}
            padding={padding}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
          >
            <Typography
              size={18}
              weight={item.highlighted ? 600 : 400}
              wrap="nowrap"
            >
              {item.name}
            </Typography>
          </Link>
        );
      } else if (item.items) {
        elements.push(
          <DropDown
            key={`${level}-${i}`}
            onClick={() => toggleDropDown(`${level}-${i}`)}
            open={dropDownOpen === `${level}-${i}`}
            isMobile={isSmallScreen}
          >
            <DropDownText>
              <Typography size={18} margin="0 5px 0 0">
                {item.name}
              </Typography>
              <StyledCaretIcon
                height={isSmallScreen ? '24px' : '14px'}
                color={theme.colors.text}
              />
            </DropDownText>
            <DropDownContent>
              {renderMenuItems(item.items, level + 1)}
            </DropDownContent>
          </DropDown>
        );
      } else {
        elements.push(
          <Link
            as={NavLink}
            level={level}
            margin={margin}
            padding={padding}
            to={item.to || ''}
            key={i}
          >
            <Typography wrap="nowrap">{item.name}</Typography>
          </Link>
        );
      }
    }

    return elements;
  };

  return (
    <HorizontalFlex
      align={isSmallScreen ? 'flex-start' : 'center'}
      direction={isSmallScreen ? 'column' : 'row'}
    >
      {renderMenuItems(menuItems)}
    </HorizontalFlex>
  );
}

export default Menu;
