import { OptionProps } from '@/components/SearchableSelect';
import { Network } from '@core/types';
import { FC } from 'react';
import { NetworkLabel } from './NetworkLabel';
import * as Styled from './Styled';

type Props = { network: Network } & OptionProps;

export const NetworkItem: FC<Props> = ({ network, ...props }) => {
  return (
    <Styled.MenuItem
      value={network.chainId}
      data-testid="network-option"
      data-network-name={network.chainName}
      data-chain-id={String(network.chainId)}
      {...props}
    >
      <NetworkLabel chainName={network.chainName} logoUri={network.logoUri} />
    </Styled.MenuItem>
  );
};
