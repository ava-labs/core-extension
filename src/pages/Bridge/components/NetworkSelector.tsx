import { useCallback, useRef, useState } from 'react';
import {
  Button,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkWithCaipId } from '@src/background/services/network/models';
interface NetworkSelectorProps {
  testId?: string;
  disabled?: boolean;
  selected?: NetworkWithCaipId;
  onSelect?: (blockchain: NetworkWithCaipId) => void;
  chainIds: string[];
}

export function NetworkSelector({
  testId,
  disabled,
  selected,
  onSelect,
  chainIds,
}: NetworkSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const selectButtonRef = useRef<HTMLDivElement>(null);
  const { getNetwork } = useNetworkContext();

  const handleClose = useCallback(
    (network: NetworkWithCaipId) => {
      setIsOpen(false);
      onSelect?.(network);
    },
    [onSelect]
  );

  return (
    <Stack sx={{ alignItems: 'flex-end' }}>
      <Button
        variant="text"
        disableRipple
        data-testid={testId}
        disabled={disabled || chainIds.length <= 1}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        ref={selectButtonRef}
        sx={{
          color: 'primary.main',
          p: 0.5,
          '&.Mui-disabled': { color: 'primary.main' },
        }}
        endIcon={
          chainIds.length > 1 &&
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
          {selected ? (
            <>
              <img src={selected.logoUri} width={16} height={16} alt="" />
              <Typography
                variant="body2"
                sx={{
                  transform: 'capitalize',
                  fontWeight: 'fontWeightSemibold',
                }}
              >
                {selected.chainName}
              </Typography>
            </>
          ) : (
            <Typography variant="body2">{t('Select target chain')}</Typography>
          )}
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
        {chainIds
          .map((chainId) => getNetwork(chainId))
          .filter((n): n is NetworkWithCaipId => typeof n !== 'undefined')
          .map((network) => {
            return (
              <MenuItem
                key={network.caipId}
                data-testid={`blockchaind-${network.caipId}`}
                onClick={() => {
                  handleClose(network);
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
                    <img src={network.logoUri} width={16} height={16} alt="" />
                    <Typography variant="body2">{network.chainName}</Typography>
                  </Stack>

                  {selected === network && <CheckIcon size={16} />}
                </Stack>
              </MenuItem>
            );
          })}
      </Menu>
    </Stack>
  );
}
