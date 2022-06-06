import {
  VerticalFlex,
  CaretIcon,
  IconDirection,
  HorizontalFlex,
  CheckmarkIcon,
  Typography,
} from '@avalabs/react-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import styled from 'styled-components';
import { useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import { ContainedDropdown } from '@src/components/common/ContainedDropdown';
import { ChainId } from '@avalabs/chains-sdk';

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

const NetworkLogo = styled.img`
  width: 16px;
`;

export function NetworkSwitcher() {
  const { network, setNetwork, networks } = useNetworkContext();

  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const selectButtonRef = useRef<HTMLDivElement>(null);

  return (
    <SelectContainer>
      <NetworkSwitcherButton
        align="center"
        justify="space-between"
        onClick={() => setIsOpen(!isOpen)}
        ref={selectButtonRef}
      >
        <NetworkLogo src={network?.logoUri} />
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
            {networks
              .filter((network) => {
                return network.chainId !== ChainId.AVALANCHE_LOCAL_ID;
              })
              .map((networkItem) => {
                return (
                  <NetworkSwitcherItem
                    key={networkItem.chainId}
                    onClick={() => {
                      setNetwork(networkItem);
                    }}
                  >
                    <HorizontalFlex align="center">
                      <NetworkLogo src={networkItem.logoUri} />
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
          </VerticalFlex>
        </DropdownContents>
      </ContainedDropdown>
    </SelectContainer>
  );
}
