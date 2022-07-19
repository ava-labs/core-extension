import { Blockchain } from '@avalabs/bridge-sdk';
import {
  CaretIcon,
  CheckmarkIcon,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  SecondaryDropDownMenu,
  SecondaryDropDownMenuItem,
  Typography,
} from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { BitcoinLogo } from '@src/components/icons/BitcoinLogo';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { blockchainDisplayNameMap } from '../models';
import EthLogo from './../../../images/tokens/eth.png';

interface NetworkSelectorProps {
  disabled?: boolean;
  selected: Blockchain;
  onSelect?: (blockchain: Blockchain) => void;
  chains: Blockchain[];
}

const EthereumLogo = () => (
  <TokenIcon
    width="24px"
    height="24px"
    src={EthLogo}
    name={Blockchain.ETHEREUM}
  />
);

const NetworkOption = styled(SecondaryDropDownMenuItem)`
  background-color: ${({ theme }) => theme.dropdown.secondary.itemBgHover};
  padding: 8px 16px;
  width: 240px;
`;

const Caret = styled(CaretIcon)`
  margin-left: 12px;
`;

export function NetworkSelector({
  disabled,
  selected,
  onSelect,
  chains,
}: NetworkSelectorProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedDisplayValue = blockchainDisplayNameMap.get(selected);

  const getBlockChainLogo = (blockchain: Blockchain) => {
    switch (blockchain) {
      case Blockchain.AVALANCHE:
        return <AvaxTokenIcon height="24" />;
      case Blockchain.ETHEREUM:
        return <EthereumLogo />;
      case Blockchain.BITCOIN:
        return <BitcoinLogo height="24" />;
      default:
        return <></>;
    }
  };

  return (
    <SecondaryDropDownMenu
      onMenuToggle={setIsOpen}
      coords={{ top: `32px`, right: `-8px` }}
      disabled={disabled || chains.length <= 1}
      icon={
        <HorizontalFlex width="100%" align={'center'} justify="space-between">
          {getBlockChainLogo(selected)}
          <Typography margin={'0 0 0 8px'} transform="capitalize">
            {selectedDisplayValue}
          </Typography>
          {chains.length > 1 && (
            <Caret
              height={'9px'}
              color={theme.colors.text1}
              direction={isOpen ? IconDirection.UP : IconDirection.DOWN}
            />
          )}
        </HorizontalFlex>
      }
    >
      {chains.includes(Blockchain.AVALANCHE) && (
        <>
          <NetworkOption
            onClick={() => {
              onSelect?.(Blockchain.AVALANCHE);
            }}
          >
            <HorizontalFlex justify="space-between" align="center" width="100%">
              <HorizontalFlex align="center">
                <AvaxTokenIcon height="24px" />
                <Typography margin="4px 12px 0 8px">
                  {blockchainDisplayNameMap.get(Blockchain.AVALANCHE)}
                </Typography>
              </HorizontalFlex>

              {selected === Blockchain.AVALANCHE && (
                <CheckmarkIcon height="16px" color={theme.colors.text1} />
              )}
            </HorizontalFlex>
          </NetworkOption>
          <HorizontalSeparator margin="0" />
        </>
      )}

      {chains.includes(Blockchain.ETHEREUM) && (
        <>
          <NetworkOption
            onClick={() => {
              onSelect?.(Blockchain.ETHEREUM);
            }}
          >
            <HorizontalFlex justify="space-between" align="center" width="100%">
              <HorizontalFlex align="center">
                <EthereumLogo />
                <Typography margin="0 12px 0 8px">
                  {blockchainDisplayNameMap.get(Blockchain.ETHEREUM)}
                </Typography>
              </HorizontalFlex>

              {selected === Blockchain.ETHEREUM && (
                <CheckmarkIcon height="16px" color={theme.colors.text1} />
              )}
            </HorizontalFlex>
          </NetworkOption>
          <HorizontalSeparator margin="0" />
        </>
      )}

      {chains.includes(Blockchain.BITCOIN) && (
        <NetworkOption
          onClick={() => {
            onSelect?.(Blockchain.BITCOIN);
          }}
        >
          <HorizontalFlex justify="space-between" align="center" width="100%">
            <HorizontalFlex align="center">
              <BitcoinLogo height="24px" />
              <Typography margin="0 12px 0 8px">
                {blockchainDisplayNameMap.get(Blockchain.BITCOIN)}
              </Typography>
            </HorizontalFlex>

            {selected === Blockchain.BITCOIN && (
              <CheckmarkIcon height="16px" color={theme.colors.text1} />
            )}
          </HorizontalFlex>
        </NetworkOption>
      )}
    </SecondaryDropDownMenu>
  );
}
