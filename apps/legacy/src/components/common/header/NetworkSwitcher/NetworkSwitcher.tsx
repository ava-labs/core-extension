import { ChainId } from '@avalabs/core-chains-sdk';
import {
  Box,
  CheckIcon,
  ChevronDownIcon,
  Chip,
  ClickAwayListener,
  GearIcon,
  Grow,
  MenuItem,
  MenuList,
  Popper,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { isChainSupportedWalletOrAccount } from '@core/common';
import {
  useAccountsContext,
  useAnalyticsContext,
  useNetworkContext,
  useWalletContext,
} from '@core/ui';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { NetworkLogo } from '../../NetworkLogo';

const defaultNetworks = [
  ChainId.AVALANCHE_MAINNET_ID,
  ChainId.AVALANCHE_TESTNET_ID,
];

const Chevron = styled(ChevronDownIcon, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{
  isOpen: boolean;
}>`
  transition: transform 0.3s ease-in-out;
  transform: rotateX(${({ isOpen }) => (isOpen ? `180deg` : `0`)});
`;

const NetworkSelectorMenuItem = styled(MenuItem)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export function NetworkSwitcher() {
  const { network, setNetwork, favoriteNetworks, networks } =
    useNetworkContext();
  const { walletDetails } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const networkList = [
    ...networks.filter(
      (networkItem) =>
        defaultNetworks.includes(networkItem.chainId) &&
        networkItem.chainId !== network?.chainId,
    ),
    ...favoriteNetworks.filter(
      (networkItem) =>
        !defaultNetworks.includes(networkItem.chainId) &&
        networkItem.chainId !== network?.chainId,
    ),
  ];

  const isActiveInList = networkList.find(
    (networkItem) => networkItem?.chainId === network?.chainId,
  );

  const [isOpen, setIsOpen] = useState(false);
  const selectButtonRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box>
        <Chip
          clickable
          data-testid="network-switcher-button"
          onClick={() => {
            if (!isOpen) {
              capture('NetworkSwitcherOpened');
            }
            setIsOpen(!isOpen);
          }}
          ref={selectButtonRef}
          avatar={
            <NetworkLogo
              src={network?.logoUri}
              width="16px"
              height="16px"
              margin="0 4px 0 0"
            />
          }
          label={<Chevron size={20} isOpen={isOpen} />}
        />

        <Popper
          open={isOpen}
          anchorEl={selectButtonRef.current}
          placement="bottom-end"
          transition
          sx={{ zIndex: 1 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={250}>
              <MenuList dense sx={{ p: 0, mt: 1 }}>
                <Stack>
                  {!isActiveInList && network && (
                    <MenuItem
                      data-testid={`active-network-${network.chainId}-button`}
                      key={network.chainId}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      sx={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        px: 1,
                        color: 'text.primary',
                      }}
                    >
                      <Stack
                        sx={{ alignItems: 'center', flexDirection: 'row' }}
                      >
                        <NetworkLogo
                          src={network.logoUri}
                          width="16px"
                          height="16px"
                        />

                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {network.chainName}
                        </Typography>
                      </Stack>
                      <CheckIcon size={16} sx={{ pl: 1 }} />
                    </MenuItem>
                  )}
                  {networkList
                    .filter((networkItem) => {
                      return networkItem.chainId !== ChainId.AVALANCHE_LOCAL_ID;
                    })
                    .map((networkItem) => {
                      if (!networkItem) {
                        return null;
                      }

                      const isSupported = isChainSupportedWalletOrAccount(
                        networkItem,
                        walletDetails,
                        activeAccount,
                      );
                      return (
                        <Tooltip
                          key={networkItem.chainId}
                          wrapWithSpan={false}
                          title={
                            !isSupported
                              ? t(
                                  'This network is not supported by the active wallet',
                                )
                              : ''
                          }
                        >
                          <NetworkSelectorMenuItem
                            data-testid={`select-network-${networkItem.chainId}-button`}
                            onClick={
                              isSupported
                                ? () => {
                                    setNetwork(networkItem);
                                    setIsOpen(false);
                                  }
                                : undefined
                            }
                            sx={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              px: 1,
                              color: 'text.secondary',
                              opacity: isSupported ? 1 : 0.5,
                              cursor: isSupported ? 'pointer' : 'not-allowed',
                            }}
                          >
                            <Stack
                              sx={{
                                alignItems: 'center',
                                flexDirection: 'row',
                              }}
                            >
                              <NetworkLogo
                                src={networkItem.logoUri}
                                width="16px"
                                height="16px"
                              />

                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {networkItem.chainName}
                              </Typography>
                            </Stack>
                            {networkItem.chainId === network?.chainId && (
                              <CheckIcon size={16} />
                            )}
                          </NetworkSelectorMenuItem>
                        </Tooltip>
                      );
                    })}
                  <NetworkSelectorMenuItem
                    data-testid="manage-networks-button"
                    key="NetworksPage"
                    onClick={() => {
                      capture('ManageNetworksClicked');
                      history.push('/networks');
                      setIsOpen(false);
                    }}
                    sx={{ flexDirection: 'row', alignItems: 'center', px: 1 }}
                    dense
                    focusVisibleClassName="sanyi"
                  >
                    <Stack sx={{ alignItems: 'center', flexDirection: 'row' }}>
                      <GearIcon size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {t('Manage Networks')}
                      </Typography>
                    </Stack>
                  </NetworkSelectorMenuItem>
                </Stack>
              </MenuList>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
