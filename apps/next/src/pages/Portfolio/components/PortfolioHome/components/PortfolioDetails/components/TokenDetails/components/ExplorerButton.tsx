import { Button } from '@avalabs/k2-alpine';
import {
  getAddressForChain,
  getExplorerAddressByNetwork,
  openNewTab,
} from '@core/common';
import { NetworkWithCaipId } from '@core/types';
import { useAccountsContext } from '@core/ui';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  network: NetworkWithCaipId;
}>;

export const ExplorerButton: FC<Props> = ({ network, children }) => {
  const { accounts } = useAccountsContext();

  const explorerUrl = network
    ? getExplorerAddressByNetwork(
        network,
        getAddressForChain(network, accounts.active),
        'address',
      )
    : undefined;

  if (!explorerUrl) {
    return null;
  }

  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      onClick={() => openNewTab({ url: explorerUrl })}
    >
      {children}
    </Button>
  );
};
