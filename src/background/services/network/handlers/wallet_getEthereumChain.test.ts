import { BITCOIN_NETWORK, BITCOIN_TEST_NETWORK } from '@avalabs/chains-sdk';
import {
  WalletGetEthereumChainHandler,
  networkToGetEthChainResponse,
} from './wallet_getEthereumChain';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';

describe('background/services/network/handlers/wallet_getEthereumChain.ts', () => {
  const networkServiceInactive = {
    activeNetwork: undefined,
  } as any;
  const networkServiceMockMainnet = {
    activeNetwork: BITCOIN_NETWORK,
  } as any;

  const networkServiceMockTestnet = {
    activeNetwork: BITCOIN_TEST_NETWORK,
  } as any;

  const getChainRequest = {
    id: '123',
    method: DAppProviderRequest.WALLET_GET_CHAIN,
  } as any;

  it('handleAuthenticated inactive', async () => {
    const handler = new WalletGetEthereumChainHandler(networkServiceInactive);
    const result = await handler.handleAuthenticated(getChainRequest);
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
    const { result, ...request } = await handler.handleAuthenticated(
      getChainRequest
    );
    expect(request).toEqual(getChainRequest);
    expect(result).toEqual(networkToGetEthChainResponse(BITCOIN_NETWORK));
    expect(result.chainName).toEqual(BITCOIN_NETWORK.chainName);
    expect(result.chainId).toEqual(`0x${BITCOIN_NETWORK.chainId.toString(16)}`);
    expect(result.isTestnet).toEqual(false);
  });
  it('handleAuthenticated testnet', async () => {
    const handler = new WalletGetEthereumChainHandler(
      networkServiceMockTestnet
    );
    const { result, ...request } = await handler.handleAuthenticated(
      getChainRequest
    );
    expect(request).toEqual(getChainRequest);
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
    const result = await handler.handleUnauthenticated(getChainRequest);
    expect(result).toEqual({
      ...getChainRequest,
      error: ethErrors.rpc.invalidRequest({
        message: 'account not connected',
      }),
    });
  });
});
