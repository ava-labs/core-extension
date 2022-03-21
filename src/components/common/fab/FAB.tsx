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
import { useDialog } from '@avalabs/react-components';
import { Moonpay } from '@avalabs/blizzard-sdk';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

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

const openMiniWindow = (url: string) => {
  window.open(
    url,
    'target',
    `toolbar=no,
    location=no,
    status=no,
    menubar=no,
    scrollbars=yes,
    resizable=yes,
    width=430px,
    height=650px,`
  );
};

const moonpayURL = async (address: string) => {
  const moonAPI = new Moonpay({ baseUrl: 'https://blizzard.avax.network/' });
  return await moonAPI.getUrl(address);
};

export function FAB() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const theme = useTheme();
  const history = useHistory();
  const { showDialog, clearDialog } = useDialog();
  const { activeAccount } = useAccountsContext();

  const onBuyClick = () => {
    let moonpayBuyURL: string;
    activeAccount &&
      moonpayURL(activeAccount?.addressC).then(
        (res) => (moonpayBuyURL = res.data)
      );

    showDialog({
      title: 'Attention',
      body: "Clicking “Continue” will take you to a page powered by our partner MoonPay, use is subject to MoonPay's terms and policies",
      confirmText: 'Yes',
      width: '343px',
      onConfirm: () => {
        clearDialog();
        moonpayBuyURL && openMiniWindow(moonpayBuyURL);
        setIsOpen(false);
        // close(); uncomment if we want the extension to close
      },
      cancelText: 'Back',
      onCancel: () => {
        clearDialog();
      },
    });
  };

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
          {[
            {
              text: 'Send',
              route: '/send',
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
              icon: <QRCodeIcon height="24px" color={theme.colors.bg1} />,
            },
            {
              text: 'Buy',
              route: '',
              icon: <BuyIcon height="21px" color={theme.colors.bg1} />,
            },
            {
              text: 'Swap',
              route: '/swap',
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
              icon: <BridgeIcon height="24px" color={theme.colors.bg1} />,
            },
          ].map(({ text, route, icon }) => (
            <ActionButton
              key={text}
              text={text}
              icon={icon}
              onClick={() => {
                !route ? onBuyClick() : history.push(route);
              }}
            />
          ))}
        </Menu>
      </FabContainer>
    </>
  );
}
