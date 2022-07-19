import {
  HorizontalFlex,
  TextButton,
  Typography,
  useIsSmallScreen,
  CaretIcon,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { useState } from 'react';
import { MenuItem, menuItems } from './MenuItems';
import { NavLink } from 'react-router-dom';

const Link = styled(TextButton)<{ isHighlighted?: boolean; level?: number }>`
  ${({ theme }) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    theme.mediaWidth.upToSmall!`
    margin: 8px 0;
    border-radius: ${theme.borderRadius};
  `};

  ${(props) =>
    `
      width: 100%;
      border-radius: 0;

      &:hover {
        background-color: ${
          props.level === 1
            ? props.theme.dropdown.secondary.itemBgHover
            : 'transparent'
        };
        text-shadow: 0px 0px 0.5px ${props.theme.colors.text1};
      }

      ${
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        props.theme.mediaWidth.upToSmall!`
        background: ${
          props.isHighlighted
            ? props.theme.dropdown.secondary.itemBgHover
            : 'transparent'
        };
        padding: ${props.level === 0 ? '16px 8px' : '8px'};
        justify-content: flex-start;
      `
      };
    `};
`;

const DropDownContent = styled(VerticalFlex)`
  display: none;
  position: absolute;
  align-items: flex-start;
  overflow: hidden;
  padding: 0;
  flex-direction: column;
  width: fit-content;
  z-index: 2;
  background: ${({ theme }) => theme.dropdown.secondary.bg};
  border: ${({ theme }) => theme.dropdown.secondary.border};
  border-radius: ${({ theme }) => theme.borderRadius};

  ${({ theme }) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    theme.mediaWidth.upToSmall!`
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

  ${(props) => `
    ${
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      props.theme.mediaWidth.upToSmall!`
      transform: rotate(-90deg);
    `
    }
  `};
`;

const DropDown = styled(HorizontalFlex)<{
  open?: boolean;
  isMobile: boolean;
}>`
  position: relative;
  cursor: pointer;

  ${({ theme }) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    theme.mediaWidth.upToSmall!`
    width: 100%;
    filter: none;

    &:hover > ${DropDownContent} {
      display: inital;
    }
  `};

  ${(props) =>
    props.isMobile
      ? props.open &&
        `
          & > ${DropDownContent} {
            display: flex;
          }

          & > ${DropDownText} {
            background: ${props.theme.colors.bg2};
          }

          & ${StyledCaretIcon} {
            transform: rotate(0);
          }
        `
      : `
          ${Link} {
            min-height: 48px;
          }
          &:hover > ${DropDownContent} {
            display: flex;
          }
          &:hover ${StyledCaretIcon} {
            transform: rotate(-180deg);
          }
          &:hover > ${Typography} {
            text-shadow: 0px 0px 1px ${props.theme.colors.text1};
          }
        `};
`;

const DropDownText = styled(Typography)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 0 12px 40px;
  cursor: pointer;

  ${({ theme }) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    theme.mediaWidth.upToSmall!`
    width: 100%;
    padding: 16px 4px 16px 8px;
    justify-content: space-between;
    margin: 8px 0;
    border-radius: ${theme.borderRadius};
  `};
`;

export function Menu() {
  const theme = useTheme();
  const isSmallScreen = useIsSmallScreen();
  const [dropDownOpen, setDropDownOpen] = useState<string>('');

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
    const padding = level === 0 ? '0' : '12px 32px';

    menuItems.forEach((item, i) => {
      if (item.href) {
        elements.push(
          <Link
            level={level}
            isHighlighted={item.highlighted}
            as="a"
            margin={margin}
            padding={padding}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
          >
            <Typography
              size={16}
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
              <Typography size={16} margin="0 5px 0 0">
                {item.name}
              </Typography>
              <StyledCaretIcon
                height={isSmallScreen ? '24px' : '14px'}
                color={theme.colors.text1}
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
    });

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
