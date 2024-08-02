import {
  BITCOIN_NETWORK,
  BITCOIN_TEST_NETWORK,
} from '@avalabs/core-chains-sdk';
import {
  WalletGetEthereumChainHandler,
  networkToGetEthChainResponse,
} from './wallet_getEthereumChain';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { buildRpcCall } from '@src/tests/test-utils';

describe('background/services/network/handlers/wallet_getEthereumChain.ts', () => {
  const networkServiceInactive = {
    getNetwork: () => undefined,
  } as any;
  const networkServiceMockMainnet = {
    getNetwork: () => BITCOIN_NETWORK,
  } as any;

  const networkServiceMockTestnet = {
    getNetwork: () => BITCOIN_TEST_NETWORK,
  } as any;

  const getChainRequest = {
    id: '123',
    method: DAppProviderRequest.WALLET_GET_CHAIN,
  } as const;

  it('handleAuthenticated inactive', async () => {
    const handler = new WalletGetEthereumChainHandler(networkServiceInactive);
    const result = await handler.handleAuthenticated(
      buildRpcCall(getChainRequest)
    );
    expect(result).toEqual({
      ...getChainRequest,
      error: ethErrors.rpc.resourceUnavailable({
        message: 'no active network',
      }),
    });
  });
  it('handleAuthenticated mainnet', async () => {
    const handler = new WalletGetEthereumChainHandler(
      networkServiceMockMainnet
    );
    const { result } = await handler.handleAuthenticated(
      buildRpcCall(getChainRequest)
    );
    expect(result).toEqual(networkToGetEthChainResponse(BITCOIN_NETWORK));
    expect(result.chainName).toEqual(BITCOIN_NETWORK.chainName);
    expect(result.chainId).toEqual(`0x${BITCOIN_NETWORK.chainId.toString(16)}`);
    expect(result.isTestnet).toEqual(false);
  });
  it('handleAuthenticated testnet', async () => {
    const handler = new WalletGetEthereumChainHandler(
      networkServiceMockTestnet
    );
    const { result } = await handler.handleAuthenticated(
      buildRpcCall(getChainRequest)
    );
    expect(result).toEqual(networkToGetEthChainResponse(BITCOIN_TEST_NETWORK));
    expect(result.chainName).toEqual(BITCOIN_TEST_NETWORK.chainName);
    expect(result.chainId).toEqual(
      `0x${BITCOIN_TEST_NETWORK.chainId.toString(16)}`
    );
    expect(result.isTestnet).toEqual(true);
  });

  it('handleUnauthenticated', async () => {
    const handler = new WalletGetEthereumChainHandler(
      networkServiceMockMainnet
    );
    const result = await handler.handleUnauthenticated(
      buildRpcCall(getChainRequest)
    );
    expect(result).toEqual({
      ...getChainRequest,
      error: ethErrors.rpc.invalidRequest({
        message: 'account not connected',
      }),
    });
  });
});
