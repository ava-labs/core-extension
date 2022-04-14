import { Big, isMainnetNetwork } from '@avalabs/avalanche-wallet-sdk';
import {
  AppConfig,
  Blockchain,
  fetchTokenBalances,
  getBtcAsset,
  getUTXOs,
} from '@avalabs/bridge-sdk';
import { network$, wallet$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom } from 'rxjs';
import { getAvalancheProvider } from '../../network/getAvalancheProvider';
import { isWalletLocked } from '../../wallet/models';
import { walletState$ } from '../../wallet/walletState';
import { bridgeConfig$ } from '../bridgeConfig';

export async function getBtcBalances() {
  const { config } = await firstValueFrom(bridgeConfig$);
  const network = await firstValueFrom(network$);
  const wallet = await firstValueFrom(wallet$);
  const walletState = await firstValueFrom(walletState$);
  if (
    !config ||
    !network ||
    !wallet ||
    !walletState ||
    isWalletLocked(walletState)
  )
    throw new Error('Not ready');

  const isMainnet = isMainnetNetwork(network.config);
  const btcAddress = wallet.getAddressBTC(isMainnet ? 'bitcoin' : 'testnet');

  const btcBalanceAvalanche = (
    await getBtcBalanceAvalanche(config, walletState.addresses.addrC)
  ).toNumber();
  const { balance: btcBalanceBitcoin, utxos: bitcoinUtxos } = await getUTXOs(
    config,
    btcAddress
  );

  return {
    bitcoinUtxos,
    btcAddress,
    btcBalanceAvalanche,
    btcBalanceBitcoin,
  };
}

async function getBtcBalanceAvalanche(
  config: AppConfig,
  address: string
): Promise<Big | undefined> {
  const btcAsset = getBtcAsset(config);
  if (!btcAsset) return;

  const network = await firstValueFrom(network$);
  const provider = getAvalancheProvider(network);

  const balancesBySymbol = await fetchTokenBalances(
    { [btcAsset.symbol]: btcAsset },
    Blockchain.AVALANCHE,
    provider,
    address
  );

  return balancesBySymbol?.[btcAsset.symbol];
}

async function getBtcBalancesHandler(request: ExtensionConnectionMessage) {
  const [result, error] = await resolve(getBtcBalances());
  if (error) return { ...request, error };
  return { ...request, result };
}

export const GetBtcBalancesRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.BRIDGE_GET_BTC_BALANCES, getBtcBalancesHandler];
