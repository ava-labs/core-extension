import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useRef, useState } from 'react';
import { ChainId } from '@avalabs/core-chains-sdk';
import { useHistory } from 'react-router-dom';
import { NetworkLogo } from '../../NetworkLogo';
import { useTranslation } from 'react-i18next';
import {
  ChevronDownIcon,
  CheckIcon,
  GearIcon,
  styled,
  Typography,
  Stack,
  Chip,
  MenuItem,
  MenuList,
  Popper,
  Grow,
  ClickAwayListener,
  Box,
} from '@avalabs/core-k2-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

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

const NetworkSelectronMenuItem = styled(MenuItem)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export function NetworkSwitcher() {
  const { network, setNetwork, favoriteNetworks, networks } =
    useNetworkContext();

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
                      return (
                        <NetworkSelectronMenuItem
                          data-testid={`select-network-${networkItem.chainId}-button`}
                          key={networkItem.chainId}
                          onClick={() => {
                            setNetwork(networkItem);
                            setIsOpen(false);
                          }}
                          sx={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            px: 1,
                            color: 'text.secondary',
                          }}
                        >
                          <Stack
                            sx={{ alignItems: 'center', flexDirection: 'row' }}
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
                        </NetworkSelectronMenuItem>
                      );
                    })}
                  <NetworkSelectronMenuItem
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
                  </NetworkSelectronMenuItem>
                </Stack>
              </MenuList>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
