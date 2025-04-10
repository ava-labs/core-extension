import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  ChevronDownIcon,
  ClickAwayListener,
  Grow,
  keyframes,
  MenuItem,
  MenuList,
  Popper,
  Stack,
  styled,
  Typography,
} from '@avalabs/core-k2-components';

import { WalletExtensionType } from 'packages/service-worker/src/services/web3/models';
import { EIP6963ProviderInfo } from '@avalabs/vm-module-types';
import { useRef, useState } from 'react';

interface WalletExtensionButtonProps {
  type?: WalletExtensionType;
  info?: EIP6963ProviderInfo;
  onClick: (index: number) => void;
  wallets?: EIP6963ProviderInfo[];
}

const flip = keyframes`
  from {
    transform: rotateX(0deg);
  }

  to {
    transform: rotateX(360deg);
  }
`;

const StyledMenuItem = styled(MenuItem)`
  img {
    transition: transform 0.3s ease-in-out;
  }
  color: ${({ theme }) => theme.palette.text.secondary};
  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
    img {
      animation: ${flip} 0.5s ease-in-out;
    }
  }
`;
const CoreButton = styled(Button)`
  img {
    transition: transform 0.3s ease-in-out;
    border-radius: 50%;
  }
  color: ${({ theme }) => theme.palette.text.secondary};
  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
    img {
      animation: ${flip} 0.5s ease-in-out;
    }
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  border-radius: 999px;
`;

export function CoreExtensionButton({
  info,
  onClick,
}: WalletExtensionButtonProps) {
  const { t } = useTranslation();

  return (
    <CoreButton
      color="secondary"
      size="large"
      sx={{ gap: 1, my: 2 }}
      onClick={onClick}
      fullWidth
    >
      <img src={info?.icon} width={24} height={24} />
      {info?.name || t('Unknown')}
    </CoreButton>
  );
}

export function WalletExtensionButton({
  wallets,
  onClick,
}: WalletExtensionButtonProps) {
  const { t } = useTranslation();
  const toggleButtonRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <StyledButtonGroup color="secondary" variant="contained" fullWidth>
      <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
        <Stack sx={{ flexDirection: 'row', width: '100%' }}>
          <Button
            ref={toggleButtonRef}
            onClick={() => setIsMenuOpen((open) => !open)}
            sx={{
              gap: 1,
              borderTopLeftRadius: '999px !important',
              borderBottomLeftRadius: '999px !important',
            }}
            data-testid={'add-primary-account'}
          >
            {t('Other Wallets')}
          </Button>

          <Button
            ref={toggleButtonRef}
            onClick={() => setIsMenuOpen((open) => !open)}
            sx={{
              width: '56px',
              borderTopRightRadius: '999px !important',
              borderBottomRightRadius: '999px !important',
            }}
            data-testid="account-options"
          >
            <ChevronDownIcon
              size={24}
              sx={{
                transition: 'transform ease-in-out .15s',
                transform: isMenuOpen ? 'rotateX(180deg)' : 'none',
              }}
            />
            <Popper
              open={isMenuOpen}
              anchorEl={toggleButtonRef.current}
              placement="top-end"
              transition
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={250}>
                  <MenuList
                    dense
                    sx={{
                      p: 0,
                      py: 0.5,
                      mb: 1,
                      overflow: 'hidden',
                      backgroundColor: 'grey.800',
                      width: '180px',
                    }}
                  >
                    {wallets &&
                      wallets.map((wallet, index) => {
                        if (wallet.rdns === 'app.core.extension') {
                          return;
                        }
                        return (
                          <StyledMenuItem
                            onClick={() => onClick(index)}
                            data-testid="add-import-account"
                            key={wallet.name}
                            sx={{ py: 1 }}
                          >
                            <img
                              src={wallet.icon}
                              height={24}
                              style={{ paddingRight: '16px' }}
                            />
                            <Typography>{wallet.name}</Typography>
                          </StyledMenuItem>
                        );
                      })}
                  </MenuList>
                </Grow>
              )}
            </Popper>
          </Button>
        </Stack>
      </ClickAwayListener>
    </StyledButtonGroup>
  );
}
