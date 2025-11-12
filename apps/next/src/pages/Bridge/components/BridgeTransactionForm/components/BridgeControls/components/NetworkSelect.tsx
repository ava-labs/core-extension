import { MenuItem, SelectProps, Stack, Typography } from '@avalabs/k2-alpine';
import { NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { FC } from 'react';
import * as Styled from '../../../../Styled';

type Props = {
  label: string;
  chains: NetworkWithCaipId['caipId'][];
  selected: NetworkWithCaipId['caipId'];
  onSelect: (chain: NetworkWithCaipId['caipId']) => void;
  disabled?: boolean;
};

const disabledProps: SelectProps = {
  disabled: true,
  // This is needed to prevent the menu from opening when the select is disabled
  onClick: (e) => e.preventDefault(),
};

export const NetworkSelect: FC<Props> = ({
  label,
  chains,
  selected,
  disabled = chains.length < 2,
  onSelect,
}) => {
  const { getNetwork } = useNetworkContext();

  const networks = chains
    .map((chain) => getNetwork(chain))
    .filter((n) => n !== undefined);

  return (
    <Styled.Select
      value={selected}
      onChange={(e) => onSelect(e.target.value as string)}
      label={<Typography variant="subtitle3">{label}</Typography>}
      fullWidth
      {...(disabled && disabledProps)}
    >
      {networks.map((network) => (
        <MenuItem
          key={network.caipId}
          data-testid={`blockchain-id-${network.caipId}`}
          value={network.caipId}
        >
          <Stack direction="row" columnGap={1} alignItems="center">
            <img src={network.logoUri} width={16} height={16} alt="" />
            <Typography variant="body3">{network.chainName}</Typography>
          </Stack>
        </MenuItem>
      ))}
    </Styled.Select>
  );
};
