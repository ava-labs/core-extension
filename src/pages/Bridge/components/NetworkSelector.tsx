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
import { useTheme } from 'styled-components';
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

export function NetworkSelector({
  disabled,
  selected,
  onSelect,
  chains,
}: NetworkSelectorProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

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
      coords={{ top: `32px`, right: `0px` }}
      disabled={disabled || chains.length <= 1}
      icon={
        <HorizontalFlex width="100%" align={'center'} justify="space-between">
          {getBlockChainLogo(selected)}
          <Typography margin={'0 16px 0 8px'} transform="capitalize">
            {selected}
          </Typography>
          {chains.length > 1 && (
            <CaretIcon
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
          <SecondaryDropDownMenuItem
            onClick={() => {
              onSelect?.(Blockchain.AVALANCHE);
            }}
          >
            <AvaxTokenIcon height="24" />
            <Typography margin="0 16px 0 8px">Avalanche</Typography>
            {selected === Blockchain.AVALANCHE && (
              <CheckmarkIcon height="16px" color={theme.colors.text1} />
            )}
          </SecondaryDropDownMenuItem>
          <HorizontalSeparator margin="0" />
        </>
      )}

      {chains.includes(Blockchain.ETHEREUM) && (
        <>
          <SecondaryDropDownMenuItem
            onClick={() => {
              onSelect?.(Blockchain.ETHEREUM);
            }}
          >
            <EthereumLogo />
            <Typography margin="0 16px 0 8px">Ethereum</Typography>
            {selected === Blockchain.ETHEREUM && (
              <CheckmarkIcon height="16px" color={theme.colors.text1} />
            )}
          </SecondaryDropDownMenuItem>
          <HorizontalSeparator margin="0" />
        </>
      )}

      {chains.includes(Blockchain.BITCOIN) && (
        <SecondaryDropDownMenuItem
          onClick={() => {
            onSelect?.(Blockchain.BITCOIN);
          }}
        >
          <BitcoinLogo height="24px" />
          <Typography margin="0 16px 0 8px">Bitcoin</Typography>
          {selected === Blockchain.BITCOIN && (
            <CheckmarkIcon height="16px" color={theme.colors.text1} />
          )}
        </SecondaryDropDownMenuItem>
      )}
    </SecondaryDropDownMenu>
  );
}
