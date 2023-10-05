import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { Account, AccountType } from '@src/background/services/accounts/models';

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
