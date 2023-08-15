import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  Stack,
  Typography,
  styled,
  Backdrop,
  QRCodeIcon,
  SwapIcon,
  BuyIcon,
  BridgeIcon,
  ArrowUpRightIcon,
  useTheme,
} from '@avalabs/k2-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

const ActionButtonWrapper = styled(Stack)`
  padding: 0 8px;
  margin: 8px 0;
  border-radius: 0;

  width: 100%;

  &:last-of-type {
    border-bottom: none;
  }
`;

const Menu = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  border-radius: 40px;
  width: ${({ isOpen }) => (isOpen ? '80px' : '40px')};
  position: absolute;
  bottom: 100%;
  right: ${({ isOpen }) => (isOpen ? 0 : '20px')};
  margin: 0 0 16px;
  background: ${({ theme, isOpen }) =>
    isOpen ? theme.palette.background.paper : 'transparent'};
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s ease-out;
  padding: 8px 0;
`;

const MenuItems = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  transition: all 0.3s;
  transform-origin: bottom;
  transform: ${({ isOpen }) =>
    isOpen ? 'translateY(0) scale(1)' : 'translateY(44px) scale(0)'};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
`;

const FabContainer = styled(Stack)`
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9;
  user-select: none;
`;

const FabButton = styled(ActionButtonWrapper, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.common.white};
  transition: transform 0.2s ease-in-out;
  transform: rotate(${({ isOpen }) => (isOpen ? '135deg' : '0')});
  color: ${({ theme }) => theme.palette.background.paper};
  margin: 8px;
  cursor: pointer;
`;

export function FAB() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const history = useHistory();
  const { checkIsFunctionAvailable } = useIsFunctionAvailable();
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const theme = useTheme();

  const ActionButton = ({ icon, text, ...rest }) => (
    <ActionButtonWrapper
      data-testid={`${text.toLowerCase()}-action-button`}
      {...rest}
    >
      <Stack
        sx={{
          alignItems: 'center',
          width: '100%',
          justifyContent: 'flex-start',
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            width: '48px',
            height: '48px',
            justifyContent: 'center',
            backgroundColor: 'common.white',
            borderRadius: '50%',
            color: 'text.secondary',
            mb: 1,
            cursor: 'pointer',
          }}
        >
          {icon}
        </Stack>
        <Typography variant="caption">{text}</Typography>
      </Stack>
    </ActionButtonWrapper>
  );

  const FABMenuItems = [
    {
      text: t('Send'),
      route: '/send',
      name: 'Send',
      icon: (
        <ArrowUpRightIcon
          size={24}
          sx={{ color: theme.palette.common.black }}
        />
      ),
    },
    {
      text: t('Receive'),
      route: '/receive',
      name: 'Receive',
      icon: <QRCodeIcon size={24} sx={{ color: theme.palette.common.black }} />,
    },
    {
      text: t('Buy'),
      route: '/buy',
      name: 'Buy',
      icon: <BuyIcon size={24} sx={{ color: theme.palette.common.black }} />,
    },
    {
      text: t('Swap'),
      route: '/swap',
      name: 'Swap',
      icon: <SwapIcon size={24} sx={{ color: theme.palette.common.black }} />,
    },
    {
      text: t('Bridge'),
      route: '/bridge',
      name: 'Bridge',
      icon: <BridgeIcon size={24} sx={{ color: theme.palette.common.black }} />,
    },
  ];

  return (
    <>
      {isOpen && (
        <Backdrop
          onClick={() => {
            capture('FABClosed');
            setIsOpen(false);
          }}
          open={isOpen}
        />
      )}
      <FabContainer>
        <Menu isOpen={isOpen}>
          <MenuItems isOpen={isOpen}>
            {isOpen &&
              FABMenuItems.map(({ text, route, icon, name }) => {
                if (!checkIsFunctionAvailable(name)) {
                  return null;
                }
                return (
                  <ActionButton
                    key={text}
                    text={text}
                    icon={icon}
                    onClick={() => {
                      capture(`FABItemSelected_${name}`);
                      history.push(route);
                    }}
                  />
                );
              })}
          </MenuItems>
          <FabButton
            data-testid="action-menu-button"
            isOpen={isOpen}
            onClick={() => {
              capture(isOpen ? 'FABClosed' : 'FABOpened');
              setIsOpen(!isOpen);
            }}
          >
            <PlusIcon size={24} />
          </FabButton>
        </Menu>
      </FabContainer>
    </>
  );
}
