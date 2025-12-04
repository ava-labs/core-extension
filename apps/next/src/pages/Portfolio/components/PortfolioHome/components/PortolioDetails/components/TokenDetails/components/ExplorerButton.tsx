import { Button } from '@avalabs/k2-alpine';
import {
  getAddressForChain,
  getExplorerAddressByNetwork,
  openNewTab,
} from '@core/common';
import { NetworkWithCaipId } from '@core/types';
import { useAccountsContext } from '@core/ui';

export const ExplorerButton = ({
  network,
  buttonText,
}: {
  network: NetworkWithCaipId;
  buttonText: string;
}) => {
  const { accounts } = useAccountsContext();

  const activeAccount = accounts.active;

  const address = getAddressForChain(network, activeAccount);
  const explorerUrl = network
    ? getExplorerAddressByNetwork(network, address, 'address')
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
      {buttonText}
    </Button>
  );
};
