import engine, { JsonRpcRequest } from './jsonRpcEngine';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { store } from '@src/store/store';
import storageListener from '../utils/storage';
import { recoverPersonalSignature } from 'eth-sig-util';
import { formatAndLog, LoggerColors } from '../utils/logging';
import { CONNECT_METHOD } from '../permissionsController';

/**
 * These are requests that are simply passthrough to the backend, they dont require
 * authentication or any special handling. We should be supporting all or most of
 *
 * @link https://eth.wiki/json-rpc/API#json-rpc-methods
 *
 * This list is currently a subset of the metamaks list and needs to be groomed, just
 * including this for now so we have something substantial
 */
const unauthenticatedRoutes = new Set([
  'eth_getAssetBalance',
  'eth_blockNumber',
  'eth_call',
  'eth_chainId',
  'eth_coinbase',
  'eth_decrypt',
  'eth_estimateGas',
  'eth_gasPrice',
  // 'eth_getBalance',
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
  'eth_submitHashrate',
  'eth_submitWork',
  'eth_syncing',
  'eth_signTransaction',
  'eth_uninstallFilter',
  'net_version',
]);

const web3CustomHandlers = {
  async eth_sendTransaction(data: JsonRpcRequest<any>) {},

  async eth_getBalance(data: JsonRpcRequest<any>) {
    const { balanceC } = store.walletStore;
    return { ...data, result: balanceC };
  },

  async eth_signTypedData(data: JsonRpcRequest<any>) {
    await store.transactionStore.saveUnapprovedMsg(data, 'signTypedData');
    openExtensionNewWindow(`sign?id=${data.id}`);

    const result = await storageListener
      .map(() => store.transactionStore.getUnnaprovedMsgById(data.id)?.result)
      .filter((result) => !!result)
      .promisify();

    return { ...data, result };
  },

  async eth_signTypedData_v3(data: JsonRpcRequest<any>) {
    await store.transactionStore.saveUnapprovedMsg(data, 'signTypedData_v3');
    openExtensionNewWindow(`sign?id=${data.id}`);

    const result = await storageListener
      .map(() => store.transactionStore.getUnnaprovedMsgById(data.id)?.result)
      .filter((result) => !!result)
      .promisify();

    return { ...data, result };
  },
  async eth_signTypedData_v4(data: JsonRpcRequest<any>) {
    await store.transactionStore.saveUnapprovedMsg(data, 'signTypedData_v4');
    openExtensionNewWindow(`sign?id=${data.id}`);

    const result = await storageListener
      .map(() => store.transactionStore.getUnnaprovedMsgById(data.id)?.result)
      .filter((result) => !!result)
      .promisify();

    return { ...data, result };
  },

  async personal_sign(data: JsonRpcRequest<any>) {
    await store.transactionStore.saveUnapprovedMsg(data, 'personal_sign');
    openExtensionNewWindow(`sign?id=${data.id}`);

    const result = await storageListener
      .map(() => store.transactionStore.getUnnaprovedMsgById(data.id)?.result)
      .filter((result) => !!result)
      .promisify();

    return { ...data, result };
  },

  // deprecated
  // async eth_sign(data: JsonRpcRequest<any>) {
  //   await store.transactionStore.saveUnapprovedMsg(data, 'eth_sign');
  //   openExtensionNewWindow(`sign?id=${data.id}`);

  //   const result = await storageListener
  //     .map(() => store.transactionStore.getUnnaprovedMsgById(data.id)?.result)
  //     .filter((result) => !!result)
  //     .promisify();

  //   return { ...data, result };
  // },

  async personal_ecRecover(data: JsonRpcRequest<any>) {
    const { params } = data;

    const msg = params[0];
    const signedResult = params[1];

    const result = await store.transactionStore.personalSigRecovery(
      msg,
      signedResult
    );

    return { ...data, result };
  },
  /**
   * This is called when the user requests to connect the via dapp. We need
   * to popup the permissions window, get permissions for the given domain
   * and then respond accordingly.
   *
   * @param data the rpc request
   * @returns
   */
  async [CONNECT_METHOD](data: JsonRpcRequest<any>) {
    const window = await openExtensionNewWindow(
      `permissions`,
      `domain=${data.params.domain}`
    );
    /**
     * If the user updates permissions and then closes the window then the permissions are written and this
     * promise is resolved. If not and the window is closed before then the promise will also be resolved and
     * the consumer will be notified that the window closed prematurely
     */
    const hasPermissions = await storageListener
      .filter(() =>
        store.permissionsStore.domainPermissionsExist(data.params.domain)
      )
      .map(() =>
        store.permissionsStore.domainHasAccountsPermissions(data.params.domain)
      )
      .promisify(
        window.removed.map(() => 'Window closed before permissions granted')
      );

    return {
      ...data,
      result: hasPermissions ? store.walletStore.accounts : [],
    };
  },
  /**
   * This is called right away by dapps to see if its already connected
   *
   * @param data the rpc request
   * @returns an array of accounts the dapp has permissions for
   */
  async eth_accounts(data: JsonRpcRequest<any>) {
    return {
      ...data,
      result: store.walletStore.accounts,
    };
  },
  async wallet_requestPermissions(data: JsonRpcRequest<any>) {
    const window = await openExtensionNewWindow(
      `permissions`,
      `domain=${data.params.domain}`
    );

    /**
     * At this point the user has previously given permissions and we are possibly editing them
     * and/or adding more permissions.
     */
    const permissions = await window.removed
      .map(() => store.permissionsStore.permissions[data.params.domain])
      .promisify();

    return {
      ...data,
      result: store.permissionsStore.getPermissionsConvertedToMetaMaskStructure(
        data.params.domain
      ),
    };
  },
  async wallet_getPermissions(data: JsonRpcRequest<any>) {
    return {
      ...data,
      result: store.permissionsStore.getPermissionsConvertedToMetaMaskStructure(
        data.params.domain
      ),
    };
  },
};

export default {
  getHandlerForKey(data: JsonRpcRequest<any>) {
    const customHandler =
      web3CustomHandlers[data.method] &&
      ((data) => {
        return web3CustomHandlers[data.method](data).then((result) => {
          formatAndLog('Wallet Controller: (web 3 custom response)', result, {
            color: LoggerColors.success,
          });
          return result;
        });
      });

    return customHandler
      ? () => customHandler(data)
      : unauthenticatedRoutes.has(data.method) &&
          (() =>
            engine.handle(data).then((result) => {
              formatAndLog(
                'Wallet Controller: (web 3 response)',
                { ...data, result },
                {
                  color: LoggerColors.success,
                }
              );
              return result;
            }));
  },
};
