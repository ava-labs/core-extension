import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  ChevronDownIcon,
  ClickAwayListener,
  CoinbaseWalletIcon,
  CoreIcon,
  Grow,
  KeyIcon,
  MenuItem,
  MenuList,
  MetaMaskIcon,
  Popper,
  Stack,
  styled,
  Typography,
  WalletIcon,
} from '@avalabs/core-k2-components';

import { WalletExtensionType } from '@src/background/services/web3/models';
import { EIP6963ProviderInfo } from '@avalabs/vm-module-types';
import { useRef, useState } from 'react';

interface WalletExtensionButtonProps {
  type?: WalletExtensionType;
  info?: EIP6963ProviderInfo;
  onClick: () => void;
  wallets?: EIP6963ProviderInfo[];
}

const StyledMenuItem = styled(MenuItem)`
  color: ${({ theme }) => theme.palette.text.secondary};
  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  border-radius: 999px;
`;

export function WalletExtensionButton({
  info,
  onClick,
}: WalletExtensionButtonProps) {
  console.log('info: ', info);
  const { t } = useTranslation();

  return (
    <Button
      color="secondary"
      size="large"
      sx={{ gap: 1, my: 2 }}
      onClick={onClick}
      fullWidth
    >
      {/* {getWalletLogo(type)}
      {getWalletDisplayName(type)} */}
      <img src={info?.icon} width={24} height={24} />
      {info?.name || t('Unknown')}
    </Button>
  );
}

export function NewButton({
  info,
  onClick,
  wallets,
}: WalletExtensionButtonProps) {
  console.log('wallets: ', wallets);
  const { t } = useTranslation();
  const toggleButtonRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <StyledButtonGroup
      // disabled={disabled}
      color="secondary"
      variant="contained"
      fullWidth
    >
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
            // disabled={isButtonDisabled}
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
                    {wallets.map((wallet) => {
                      if (wallet.rdns === 'app.core.extension') {
                        return;
                      }
                      return (
                        <StyledMenuItem
                          onClick={() => console.log('StyledMenuItem onclick')}
                          data-testid="add-import-account"
                          key={wallet.name}
                          sx={{ py: 1 }}
                        >
                          <img
                            src={wallet.icon}
                            // width={24}
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
