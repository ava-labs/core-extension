import {
  VerticalFlex,
  CaretIcon,
  IconDirection,
  HorizontalFlex,
  CheckmarkIcon,
  Typography,
  GearIcon,
} from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import styled from 'styled-components';
import { useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import { ContainedDropdown } from '@src/components/common/ContainedDropdown';
import { ChainId } from '@avalabs/chains-sdk';
import { useHistory } from 'react-router-dom';
import { NetworkLogo } from '../../NetworkLogo';
import { useTranslation } from 'react-i18next';

const NetworkSwitcherButton = styled(HorizontalFlex)`
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.stroke1};
  padding: 4px 8px;
  width: 52px;
  cursor: pointer;
  border: 1px solid #464648;
  box-sizing: border-box;
  user-select: none;
`;

const NetworkSwitcherItem = styled(HorizontalFlex)`
  color: ${({ theme }) => theme.colors.text1};
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.colors.bg2};
  }
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[700]};
  :last-of-type {
    border-bottom: none;
  }
`;

const DropdownContents = styled(VerticalFlex)`
  flex-grow: 1;
  background: ${({ theme }) => theme.colors.bg3};
  border-radius: 0 0 8px 8px;
`;

const SelectContainer = styled.div`
  position: relative;
`;

const defaultNetworks = [
  ChainId.AVALANCHE_MAINNET_ID,
  ChainId.AVALANCHE_TESTNET_ID,
];

export function NetworkSwitcher() {
  const { network, setNetwork, favoriteNetworks, networks } =
    useNetworkContext();
  const networkList = [
    ...networks.filter(
      (networkItem) =>
        defaultNetworks.includes(networkItem.chainId) &&
        networkItem.chainId !== network?.chainId
    ),
    ...favoriteNetworks.filter(
      (networkItem) =>
        !defaultNetworks.includes(networkItem.chainId) &&
        networkItem.chainId !== network?.chainId
    ),
  ];

  const isActiveInList = networkList.find(
    (networkItem) => networkItem?.chainId === network?.chainId
  );

  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const selectButtonRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <SelectContainer>
      <NetworkSwitcherButton
        data-testid="network-switcher-button"
        align="center"
        justify="space-between"
        onClick={() => setIsOpen(!isOpen)}
        ref={selectButtonRef}
      >
        <NetworkLogo src={network?.logoUri} width="16px" height="16px" />

        <CaretIcon
          height={'12px'}
          color={theme.colors.text1}
          direction={isOpen ? IconDirection.UP : IconDirection.DOWN}
        />
      </NetworkSwitcherButton>
      <ContainedDropdown
        anchorEl={selectButtonRef}
        isOpen={isOpen}
        width="220px"
        height="auto"
        margin="8px 0 0 0"
        borderRadius="8px"
        setIsOpen={setIsOpen}
      >
        <DropdownContents>
          <VerticalFlex>
            {!isActiveInList && network && (
              <NetworkSwitcherItem
                data-testid={`active-network-${network.chainId}-button`}
                key={network.chainId}
                onClick={() => {
                  setNetwork(network);
                }}
              >
                <HorizontalFlex align="center">
                  <NetworkLogo
                    src={network.logoUri}
                    width="16px"
                    height="16px"
                  />

                  <Typography margin="0 0 0 8px" weight={600} size={14}>
                    {network.chainName}
                  </Typography>
                </HorizontalFlex>
                <CheckmarkIcon height="16px" color={theme.colors.text1} />
              </NetworkSwitcherItem>
            )}
            {networkList
              .filter((network) => {
                return network.chainId !== ChainId.AVALANCHE_LOCAL_ID;
              })
              .map((networkItem) => {
                if (!networkItem) {
                  return null;
                }
                return (
                  <NetworkSwitcherItem
                    data-testid={`select-network-${networkItem.chainId}-button`}
                    key={networkItem.chainId}
                    onClick={() => {
                      setNetwork(networkItem);
                    }}
                  >
                    <HorizontalFlex align="center">
                      <NetworkLogo
                        src={networkItem.logoUri}
                        width="16px"
                        height="16px"
                      />

                      <Typography margin="0 0 0 8px" weight={600} size={14}>
                        {networkItem.chainName}
                      </Typography>
                    </HorizontalFlex>
                    {networkItem.chainId === network?.chainId && (
                      <CheckmarkIcon height="16px" color={theme.colors.text1} />
                    )}
                  </NetworkSwitcherItem>
                );
              })}
            <NetworkSwitcherItem
              data-testid="manage-networks-button"
              key="NetworksPage"
              onClick={() => {
                history.push('/networks');
                setIsOpen(false);
              }}
            >
              <HorizontalFlex align="center">
                <GearIcon color={theme.colors.text1} />
                <Typography margin="0 0 0 8px" weight={600} size={14}>
                  {t('Manage Networks')}
                </Typography>
              </HorizontalFlex>
            </NetworkSwitcherItem>
          </VerticalFlex>
        </DropdownContents>
      </ContainedDropdown>
    </SelectContainer>
  );
}
