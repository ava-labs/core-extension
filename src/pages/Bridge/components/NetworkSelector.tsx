import { Blockchain } from '@avalabs/core-bridge-sdk';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { BitcoinLogo } from '@src/components/icons/BitcoinLogo';
import { useCallback, useRef, useState } from 'react';
import { blockchainDisplayNameMap } from '../models';
import {
  Button,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EthereumColorIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

interface NetworkSelectorProps {
  testId?: string;
  disabled?: boolean;
  selected: Blockchain;
  onSelect?: (blockchain: Blockchain) => void;
  chains: Blockchain[];
}

const getBlockChainLogo = (blockchain: Blockchain) => {
  switch (blockchain) {
    case Blockchain.AVALANCHE:
      return <AvaxTokenIcon height="16" />;
    case Blockchain.ETHEREUM:
      return <EthereumColorIcon height="16" width="16" />;
    case Blockchain.BITCOIN:
      return <BitcoinLogo height="16" />;
    default:
      return <></>;
  }
};

export function NetworkSelector({
  testId,
  disabled,
  selected,
  onSelect,
  chains,
}: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectButtonRef = useRef<HTMLDivElement>(null);

  const selectedDisplayValue = blockchainDisplayNameMap.get(selected);

  const handleClose = useCallback(
    (blockchain: Blockchain) => {
      setIsOpen(false);
      onSelect?.(blockchain);
    },
    [onSelect]
  );

  const getMenuItem = useCallback(
    (dataId: string, blockchain: Blockchain) => {
      if (!chains.includes(blockchain)) {
        return null;
      }

      return (
        <MenuItem
          data-testid={dataId}
          onClick={() => {
            handleClose(blockchain);
          }}
          disableRipple
          sx={{ minHeight: 'auto', py: 1 }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Stack
              direction="row"
              sx={{
                columnGap: 1,
                alignItems: 'center',
              }}
            >
              {getBlockChainLogo(blockchain)}
              <Typography variant="body2">
                {blockchainDisplayNameMap.get(blockchain)}
              </Typography>
            </Stack>

            {selected === blockchain && <CheckIcon size={16} />}
          </Stack>
        </MenuItem>
      );
    },
    [chains, handleClose, selected]
  );

  return (
    <Stack sx={{ alignItems: 'flex-end' }}>
      <Button
        variant="text"
        disableRipple
        data-testid={testId}
        disabled={disabled || chains.length <= 1}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        ref={selectButtonRef}
        sx={{ color: 'primary.main', p: 0, pb: 1, pr: 1 }}
        endIcon={
          chains.length > 1 &&
          (isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />)
        }
      >
        <Stack
          direction="row"
          sx={{
            columnGap: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {getBlockChainLogo(selected)}
          <Typography
            variant="body2"
            sx={{ transform: 'capitalize', fontWeight: 'fontWeightSemibold' }}
          >
            {selectedDisplayValue}
          </Typography>
        </Stack>
      </Button>
      <Menu
        anchorEl={selectButtonRef.current}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        PaperProps={{
          sx: { width: 220, backgroundColor: 'grey.800', mr: 3 },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {getMenuItem('bridge-avax-chain-option', Blockchain.AVALANCHE)}
        {getMenuItem('bridge-eth-chain-option', Blockchain.ETHEREUM)}
        {getMenuItem('bridge-btc-chain-option', Blockchain.BITCOIN)}
      </Menu>
    </Stack>
  );
}
