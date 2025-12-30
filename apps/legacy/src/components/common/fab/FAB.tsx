import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
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
  Button,
  LightningIcon,
  Popper,
  Grow,
  Collapse,
  XIcon,
  IconButton,
} from '@avalabs/core-k2-components';

import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import { getCoreWebUrl } from '@core/common';
import { Flipper } from '../Flipper';

const ActionButtonWrapper = styled(Stack)`
  padding: 0 8px;
  margin: 8px 0;
  border-radius: 0;
  cursor: pointer;
  align-items: center;
  display: flex;
  gap: 4px;
  width: 100%;

  .button::after {
    content: '';
    position: absolute;
    bottom: -18px;
    height: 18px;
    width: 100%;
  }

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
  transform-origin: bottom;
  padding: 8px 0 12px;
  z-index: ${({ theme }) => theme.zIndex.fab};
`;

const ButtonText = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})<{ isExpanded }>`
  color: ${({ isExpanded }) => (isExpanded ? 'inherit' : '#fff')};
  transition: color 0.2s ease-in-out;
  padding-left: ${({ theme }) => theme.spacing(1)};
`;

const ActionButton = ({ icon, text, ...rest }) => (
  <ActionButtonWrapper
    data-testid={`${text.toLowerCase()}-action-button`}
    {...rest}
  >
    <IconButton
      color="primary"
      variant="contained"
      size="large"
      className="button"
    >
      {icon}
    </IconButton>

    <Typography variant="caption">{text}</Typography>
  </ActionButtonWrapper>
);

export function FAB({ isContentScrolling }: { isContentScrolling: boolean }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const history = useHistory();
  const { checkIsFunctionSupported } = useIsFunctionAvailable({});
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const theme = useTheme();
  const fabRef = useRef<HTMLButtonElement>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [isExpanded, setIsExpanded] = useState(true);

  const FABMenuItems = [
    {
      text: t('Send'),
      route: '/send',
      name: FunctionNames.SEND,
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
      name: FunctionNames.RECEIVE,
      icon: <QRCodeIcon size={24} sx={{ color: theme.palette.common.black }} />,
    },
    {
      text: t('Swap'),
      route: '/swap',
      name: FunctionNames.SWAP,
      icon: <SwapIcon size={24} sx={{ color: theme.palette.common.black }} />,
    },
    {
      text: t('Buy'),
      name: FunctionNames.BUY,
      icon: <BuyIcon size={24} sx={{ color: theme.palette.common.black }} />,
      onclick: () =>
        window.open(`${getCoreWebUrl()}/buy`, '_blank', 'noreferrer'),
    },
    {
      text: t('Bridge'),
      route: '/bridge',
      name: FunctionNames.BRIDGE,
      icon: <BridgeIcon size={24} sx={{ color: theme.palette.common.black }} />,
    },
  ].filter(({ name }) => checkIsFunctionSupported(name));

  const fabText = isOpen ? t('Close') : t('Actions');

  useEffect(() => {
    if (isContentScrolling) {
      // When the user starts scrolling, we hide the action button.
      // We also delay it a little bit to prevent it from hiding
      // when the user scrolls just a little bit, or the scrollable
      // area is short.
      fadeTimer.current = setTimeout(() => {
        setIsExpanded(false);
      }, 400);
    } else {
      // We also wait a little bit before showing it back again.
      // This prevents it from popping up too fast when the user scrolls
      // just a tiny bit at a time: scroll -> quick pause -> scroll again.
      fadeTimer.current = setTimeout(() => {
        setIsExpanded(true);
      }, 200);
    }

    return () => {
      if (fadeTimer.current !== undefined) {
        clearTimeout(fadeTimer.current);
      }
    };
  }, [isContentScrolling]);

  if (!FABMenuItems.length) {
    return null;
  }

  return (
    <>
      <Backdrop
        open={isOpen}
        onClick={() => {
          capture('FABClosed');
          setIsOpen(false);
        }}
        sx={{ zIndex: theme.zIndex.fab }}
      />
      <Grow in={isExpanded}>
        <Button
          ref={fabRef}
          size="xlarge"
          data-testid="action-menu-button"
          onClick={() => {
            capture(isOpen ? 'FABClosed' : 'FABOpened');
            setIsOpen(!isOpen);
          }}
          sx={{
            p: 2,
            height: 56,
            position: 'fixed',
            zIndex: theme.zIndex.fab,
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            ':active': {
              backgroundColor: '#a0a0a0', // By default, the buttons in active state have a semi-transparent background - we don't want that here.
            },
          }}
        >
          <Flipper size={24} isFlipped={!isOpen}>
            <XIcon />
            <LightningIcon />
          </Flipper>
          <Collapse orientation="horizontal" in={isExpanded} unmountOnExit>
            <ButtonText isExpanded={isExpanded}>{fabText}</ButtonText>
          </Collapse>
          <Popper
            open={isOpen}
            anchorEl={fabRef.current}
            placement="top-end"
            transition
            sx={{ zIndex: theme.zIndex.fab }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} timeout={250}>
                <Menu isOpen={isOpen}>
                  {isOpen &&
                    FABMenuItems.map(({ text, route, icon, name, onclick }) => {
                      if (!checkIsFunctionSupported(name)) {
                        return null;
                      }
                      return (
                        <ActionButton
                          key={text}
                          text={text}
                          icon={icon}
                          onClick={() => {
                            capture(`FABItemSelected_${name}`);
                            onclick?.();
                            if (!route) {
                              return;
                            }
                            history.push(route);
                          }}
                        />
                      );
                    })}
                </Menu>
              </Grow>
            )}
          </Popper>
        </Button>
      </Grow>
    </>
  );
}
