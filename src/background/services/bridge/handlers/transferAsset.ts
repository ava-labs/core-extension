import {
  Big,
  bnToBig,
  stringToBN,
  WalletType,
} from '@avalabs/avalanche-wallet-sdk';
import {
  Blockchain,
  transferAsset as transferAssetSDK,
  WrapStatus,
  EthereumConfigAsset,
  NativeAsset,
} from '@avalabs/bridge-sdk';
import { network$, wallet$ } from '@avalabs/wallet-react-components';
import Common, { Chain } from '@ethereumjs/common';
import { Transaction, TxData } from '@ethereumjs/tx';
import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequest,
} from '@src/background/connections/models';
import { BNLike, BufferLike } from 'ethereumjs-util';
import { BigNumber, BigNumberish } from 'ethers';
import { firstValueFrom } from 'rxjs';
import { MAINNET_NETWORK } from '../../network/models';
import { isWalletLocked } from '../../wallet/models';
import { walletState$ } from '../../wallet/walletState';
import { bridgeConfig$ } from '../bridgeConfig';
import { getAvalancheProvider } from '../../network/getAvalancheProvider';
import { getEthereumProvider } from '../getEthereumProvider';
import { TransferEventType } from '../models';
import { transferEvent$ } from '../transferEvent';

export async function transferAsset(
  currentBlockchain: Blockchain,
  amount: Big,
  account: string,
  asset: EthereumConfigAsset | NativeAsset,
  wallet: WalletType
): Promise<TransactionResponse | undefined> {
  const config = (await firstValueFrom(bridgeConfig$))?.config;
  if (!config) throw new Error('missing bridge config');

  const network = await firstValueFrom(network$);
  if (!network) throw new Error('missing network');

  const avalancheProvider = getAvalancheProvider(network);
  const ethereumProvider = getEthereumProvider(network);

  const handleStatusChange = (status: WrapStatus) =>
    transferEvent$.next({ type: TransferEventType.WRAP_STATUS, status });
  const handleTxHashChange = (txHash: string) =>
    transferEvent$.next({ type: TransferEventType.TX_HASH, txHash });

  const isMainnet = network.chainId === MAINNET_NETWORK.chainId;
  const common =
    currentBlockchain === Blockchain.AVALANCHE
      ? Common.custom({
          networkId: network?.config.networkID,
          chainId: parseInt(network.chainId),
        })
      : new Common({
          chain: isMainnet ? Chain.Mainnet : Chain.Rinkeby,
        });

  return await transferAssetSDK(
    currentBlockchain,
    amount,
    account,
    asset,
    avalancheProvider,
    ethereumProvider,
    config,
    handleStatusChange,
    handleTxHashChange,
    (txData) => signTransaction(wallet, common, txData)
  );
}

async function signTransaction(
  wallet: WalletType,
  common: Common,
  txData: TransactionRequest
): Promise<string> {
  const tx = Transaction.fromTxData(convertTxData(txData), {
    common: common as any /* fix "private property '_chainParams'" conflict */,
  });
  const signedTx = await wallet.signEvm(tx);
  const txHex = '0x' + signedTx.serialize().toString('hex');
  return txHex;
}

/**
 * Convert tx data from `TransactionRequest` (ethers) to `TxData` (@ethereumjs)
 */
function convertTxData(txData: TransactionRequest): TxData {
  return {
    to: txData.to,
    nonce: makeBNLike(txData.nonce),
    gasPrice: makeBNLike(txData.gasPrice),
    gasLimit: makeBNLike(txData.gasLimit),
    value: makeBNLike(txData.value),
    data: txData.data as BufferLike,
    type: txData.type,
  };
}

function makeBNLike(n: BigNumberish | undefined): BNLike | undefined {
  if (n == null) return undefined;
  return BigNumber.from(n).toHexString();
}

export async function transferAssetHandler(
  request: ExtensionConnectionMessage
): Promise<ExtensionConnectionMessageResponse<TransactionResponse>> {
  const wallet = await firstValueFrom(wallet$);
  const walletState = await firstValueFrom(walletState$);
  if (!wallet || !walletState || isWalletLocked(walletState))
    return {
      ...request,
      error: 'wallet is not ready',
    };

  const [currentBlockchain, amountStr, asset] = request.params || [];

  const amount = bnToBig(
    stringToBN(amountStr, asset.denomination),
    asset.denomination
  );
  const account = walletState.addresses.addrC;

  try {
    const result = await transferAsset(
      currentBlockchain,
      amount,
      account,
      asset,
      wallet
    );

    return {
      ...request,
      result,
    };
  } catch (error: any) {
    // user declined the transaction
    console.error(error);

    return {
      ...request,
      error: 'User declined the transaction',
    };
  }
}
export const TransferAssetRequest: [
  ExtensionRequest,
  ConnectionRequestHandler<TransactionResponse>
] = [ExtensionRequest.BRIDGE_TRANSFER_ASSET, transferAssetHandler];
