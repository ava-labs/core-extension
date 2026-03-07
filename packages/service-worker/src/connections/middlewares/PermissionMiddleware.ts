import { AccountsService } from '../../services/accounts/AccountsService';
import { LockService } from '../../services/lock/LockService';
import { PermissionsService } from '../../services/permissions/PermissionsService';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  DAppProviderRequest,
  JsonRpcRequest,
  JsonRpcResponse,
} from '@core/types';
import { Middleware } from './models';
import { RpcMethod } from '@avalabs/vm-module-types';
import { WHITELISTED_DOMAINS } from '@core/common';

const RESTRICTED_METHODS = Object.freeze([] as string[]);

/**
 * All unrestricted methods recognized by the PermissionController.
 * Unrestricted methods are ignored by the permission system, but every
 * JSON-RPC request seen by the permission system must correspond to a
 * restricted or unrestricted method, or the request will be rejected with a
 * "method not found" error.
 */
export const UNRESTRICTED_METHODS = Object.freeze([
  'bitcoin_signTransaction',
  'eth_accounts',
  'eth_requestAccounts',
  'eth_baseFee',
  'eth_blockNumber',
  'eth_call',
  'eth_chainId',
  'eth_coinbase',
  'eth_decrypt',
  'eth_estimateGas',
  'eth_feeHistory',
  'eth_gasPrice',
  'eth_getBalance',
  'eth_getBlockByHash',
  'eth_getBlockByNumber',
  'eth_getBlockTransactionCountByHash',
  'eth_getBlockTransactionCountByNumber',
  'eth_getCode',
  'eth_getEncryptionPublicKey',
  'eth_getFilterChanges',
  'eth_getFilterLogs',
  'eth_getLogs',
  'eth_getProof',
  'eth_getStorageAt',
  'eth_getTransactionByBlockHashAndIndex',
  'eth_getTransactionByBlockNumberAndIndex',
  'eth_getTransactionByHash',
  'eth_getTransactionCount',
  'eth_getTransactionReceipt',
  'eth_getUncleByBlockHashAndIndex',
  'eth_getUncleByBlockNumberAndIndex',
  'eth_getUncleCountByBlockHash',
  'eth_getUncleCountByBlockNumber',
  'eth_getWork',
  'eth_hashrate',
  'eth_mining',
  'eth_newBlockFilter',
  'eth_newFilter',
  'eth_newPendingTransactionFilter',
  'eth_protocolVersion',
  'eth_sendRawTransaction',
  'eth_sendTransaction',
  'eth_sign',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
  'eth_submitHashrate',
  'eth_submitWork',
  'eth_syncing',
  'eth_uninstallFilter',
  'avalanche_getProviderState',
  'avalanche_sendDomainMetadata',
  'metamask_watchAsset',
  'net_listening',
  'net_peerCount',
  'net_version',
  'personal_ecRecover',
  'personal_sign',
  'wallet_switchEthereumChain',
  'wallet_addEthereumChain',
  'wallet_watchAsset',
  'wallet_requestPermissions',
  'web3_clientVersion',
  'web3_sha3',
  'avalanche_getIsDefaultExtensionState',
  'avalanche_selectWallet',
  DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE,
  DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
  DAppProviderRequest.AVALANCHE_SIGN_TRANSACTION,
  DAppProviderRequest.AVALANCHE_SIGN_MESSAGE,
  DAppProviderRequest.AVALANCHE_GET_ACCOUNT_PUB_KEY,
  DAppProviderRequest.WALLET_ADD_NETWORK,
  DAppProviderRequest.WALLET_GET_CHAIN,
  DAppProviderRequest.WALLET_GET_PUBKEY,
  DAppProviderRequest.WALLET_CONNECT,
  RpcMethod.HVM_SIGN_TRANSACTION,
  RpcMethod.SOLANA_SIGN_TRANSACTION,
  RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION,
  RpcMethod.SOLANA_SIGN_MESSAGE,
  DAppProviderRequest.AGENT_DECLARE_IDENTITY,
]);

const CORE_METHODS = Object.freeze([
  'avalanche_getContacts',
  'avalanche_createContact',
  'avalanche_updateContact',
  'avalanche_removeContact',
  'avalanche_getAccounts',
  'avalanche_getBridgeState',
  'avalanche_selectAccount',
  'avalanche_setDeveloperMode',
  DAppProviderRequest.ACCOUNT_RENAME,
  DAppProviderRequest.ACCOUNTS_DELETE,
  DAppProviderRequest.AVALANCHE_ADD_ACCOUNT,
  DAppProviderRequest.BITCOIN_SEND_TRANSACTION,
  DAppProviderRequest.WALLET_RENAME,
  DAppProviderRequest.WALLET_GET_NETWORK_STATE,
  DAppProviderRequest.WALLET_GET_SETTINGS,
  DAppProviderRequest.WALLET_SET_SETTINGS,
  DAppProviderRequest.WALLET_ENABLE_NETWORK,
]);

export function PermissionMiddleware(
  permissionService: PermissionsService,
  accountsService: AccountsService,
  lockService: LockService,
): Middleware<
  ExtensionConnectionMessage | JsonRpcRequest,
  ExtensionConnectionMessageResponse<any, any> | JsonRpcResponse
> {
  return async (context, next, error) => {
    if (lockService.locked) {
      context.authenticated = false;
      next();
      return;
    }

    // check if domain has permission
    const domain = context.domainMetadata?.domain ?? '';
    const activeAccount = await accountsService.getActiveAccount();

    if (domain && activeAccount) {
      context.authenticated =
        await permissionService.hasDomainPermissionForAccount(
          domain,
          activeAccount,
        );
    }

    const method = context.request.params.request.method;

    if (RESTRICTED_METHODS.includes(method)) {
      if (context.authenticated === false) {
        error(new Error('No permission to access requested method.'));
      } else {
        next();
      }
      return;
    }

    if (CORE_METHODS.includes(method)) {
      const [, ...domainWithoutSubdomain] = domain.split('.'); // support any subdomains of core-web.pages.dev

      if (
        context.authenticated === true &&
        (WHITELISTED_DOMAINS.includes(domain) ||
          WHITELISTED_DOMAINS.includes(domainWithoutSubdomain.join('.')))
      ) {
        next();
      } else {
        error(new Error('No permission to access requested method.'));
      }
      return;
    }
    if (!UNRESTRICTED_METHODS.includes(method)) {
      error(new Error('Unrecognized method'));
      return;
    }
    next();
  };
}
