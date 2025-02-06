import type { Network } from '@avalabs/core-chains-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import type { Account } from '@src/background/services/accounts/models';
import { AccountType } from '@src/background/services/accounts/models';

function shouldUseWalletConnectApproval(network: Network, account: Account) {
  // We are not supporting CoreEth as a network
  if (network.vmName === NetworkVMType.CoreEth) {
    return false;
  }

  if (
    account.type === AccountType.FIREBLOCKS ||
    account.type === AccountType.WALLET_CONNECT
  ) {
    return network.vmName === NetworkVMType.BITCOIN ? false : true;
  }

  return false;
}

export default shouldUseWalletConnectApproval;
