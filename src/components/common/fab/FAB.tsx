import {
  PlusIcon,
  QRCodeIcon,
  Typography,
  SwitchIcon,
  HorizontalFlex,
  TextButton,
  IconDirection,
  BridgeIcon,
  ArrowIcon,
  Overlay,
  VerticalFlex,
  BuyIcon,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import { useBuyClick } from '@src/hooks/useBuyClick';

const ActionButtonWrapper = styled(TextButton)`
  padding: 8px;
  border-radius: 0;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.stroke2}66`};
  width: 100%;

  &:hover {
    background: ${({ theme }) => `${theme.colors.bg1}0A`};
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

const Menu = styled.div`
  background: ${({ theme }) => theme.colors.text1};
  border-radius: 13px;
  width: 136px;
  position: absolute;
  bottom: 100%;
  right: 0;
  margin: 0 0 16px;
`;

const FabContainer = styled(VerticalFlex)<{ open: boolean }>`
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9;

  ${Menu} {
    transition: all 0.2s;
    transform-origin: bottom right;
    transform: ${({ open }) =>
      open ? 'translateY(0) scale(1)' : 'translateY(44px) scale(0)'};
    opacity: ${({ open }) => (open ? '1' : '0')};
  }
`;

const FabButton = styled(TextButton)<{ open: boolean }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.text1};
  border-radius: 50%;

  transition: transform 0.2s ease-in-out;
  transform: rotate(${({ open }) => (open ? '135deg' : '0')});
`;

const InvisibleOverlay = styled(Overlay)`
  z-index: 8;
  backdrop-filter: unset;
  background-color: transparent;
`;

export function FAB() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const theme = useTheme();
  const history = useHistory();
  const { checkIsFunctionAvailable } = useIsFunctionAvailable();
  const { onBuyClick } = useBuyClick();

  const ActionButton = ({ icon, text, ...rest }) => (
    <ActionButtonWrapper {...rest}>
      <HorizontalFlex align="center" justify="flex-start" width="100%">
        <HorizontalFlex
          width="24px"
          height="24px"
          align="center"
          justify="center"
        >
          {icon}
        </HorizontalFlex>
        <Typography
          margin="0 0 0 8px"
          size={14}
          height="24px"
          weight={600}
          color={theme.colors.bg1}
        >
          {text}
        </Typography>
      </HorizontalFlex>
    </ActionButtonWrapper>
  );

  const FABMenuItems = [
    {
      text: 'Send',
      route: '/send',
      name: 'Send',
      icon: (
        <ArrowIcon
          height="21px"
          color={theme.colors.bg1}
          style={{
            transform: `rotate(315deg)`,
          }}
        />
      ),
    },
    {
      text: 'Receive',
      route: '/receive',
      name: 'Receive',
      icon: <QRCodeIcon height="24px" color={theme.colors.bg1} />,
    },
    {
      text: 'Buy',
      route: '',
      name: 'Buy',
      icon: <BuyIcon height="21px" color={theme.colors.bg1} />,
    },
    {
      text: 'Swap',
      route: '/swap',
      name: 'Swap',
      icon: (
        <SwitchIcon
          direction={IconDirection.RIGHT}
          height="21px"
          color={theme.colors.bg1}
        />
      ),
    },
    {
      text: 'Bridge',
      route: '/bridge',
      name: 'Bridge',
      icon: <BridgeIcon height="24px" color={theme.colors.bg1} />,
    },
  ];

  return (
    <>
      {isOpen && <InvisibleOverlay onClick={() => setIsOpen(false)} />}
      <FabContainer open={isOpen}>
        <FabButton
          open={isOpen}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <PlusIcon height="16px" color={theme.colors.bg1} />
        </FabButton>
        <Menu>
          {FABMenuItems.map(({ text, route, icon, name }) => {
            if (!checkIsFunctionAvailable(name)) {
              return null;
            }
            return (
              <ActionButton
                key={text}
                text={text}
                icon={icon}
                onClick={() => {
                  !route ? onBuyClick() : history.push(route);
                }}
              />
            );
          })}
        </Menu>
      </FabContainer>
    </>
  );
}
