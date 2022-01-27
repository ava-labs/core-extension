import {
  PlusIcon,
  QRCodeIcon,
  Typography,
  SwitchIcon,
  Overlay,
  HorizontalFlex,
  TextButton,
  IconDirection,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { Fab } from 'react-tiny-fab';
import { cloneElement, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './fab-styles.css';

const ActionButtonWrapper = styled(TextButton)`
  padding: 16px 12px;
  transform-origin: bottom right;
  border-radius: 0;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.stroke2}`};
`;

const Menu = styled.div`
  background: ${({ theme }) => theme.colors.text1};
  border-radius: 13px;
`;

export function FAB() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const theme = useTheme();
  const history = useHistory();

  function setColorWhenActive({
    url,
    isDisabled = false,
    isIcon,
  }: {
    url: string;
    isDisabled?: boolean;
    isIcon?: boolean;
  }) {
    if (isDisabled) return theme.colors.disabled;

    if (isIcon) {
      return history.location.pathname === url
        ? theme.colors.primary1
        : theme.colors.bg1;
    }

    return history.location.pathname === url
      ? theme.colors.primary1
      : theme.colors.bg1;
  }

  const ActionButton = ({ icon, text, route, color, ...rest }) => (
    <ActionButtonWrapper {...rest}>
      <HorizontalFlex align="center" justify="flex-start">
        {cloneElement(icon, {
          color: setColorWhenActive({ url: route, isIcon: true }),
        })}
        <Typography
          margin="0 0 0 12px"
          width="160px"
          align="left"
          size={18}
          weight={600}
          color={color}
        >
          {text}
        </Typography>
      </HorizontalFlex>
    </ActionButtonWrapper>
  );

  return (
    <>
      <Overlay
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'initial' : 'none',
          zIndex: 8,
          backdropFilter: 'unset',
          backgroundColor: 'transparent',
        }}
        onClick={() => setIsOpen(false)}
      />
      <Fab
        mainButtonStyles={{
          background: isOpen ? theme.colors.text1 : theme.colors.primary1,
        }}
        style={{
          margin: 0,
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 9,
        }}
        icon={
          <PlusIcon color={isOpen ? theme.colors.bg1 : theme.colors.icon1} />
        }
        onClick={() => setIsOpen(!isOpen)}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore for some reason `className` doesn't show as a valid prop
        className={`rtf ${isOpen ? 'open' : 'closed'}`}
      >
        <Menu>
          {[
            {
              text: 'Receive',
              route: '/receive',
              icon: <QRCodeIcon width="24px" color={theme.colors.bg1} />,
            },
            {
              text: 'Swap',
              route: '/swap',
              icon: (
                <SwitchIcon
                  direction={IconDirection.RIGHT}
                  width="24px"
                  color={theme.colors.bg1}
                />
              ),
            },
          ].map(({ text, route, icon }) => (
            <ActionButton
              key={text}
              route={route}
              color={setColorWhenActive({ url: route })}
              text={text}
              icon={icon}
              onClick={() => history.push(route)}
            />
          ))}
        </Menu>
      </Fab>
    </>
  );
}
