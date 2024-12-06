import { ChainId } from '@avalabs/core-chains-sdk';

export function getXPChainIds(isMainnet: boolean) {
  const xChainId = isMainnet ? ChainId.AVALANCHE_X : ChainId.AVALANCHE_TEST_X;
  const pChainId = isMainnet ? ChainId.AVALANCHE_P : ChainId.AVALANCHE_TEST_P;

  return [pChainId, xChainId];
}

export function getDefaultChainIds(isMainnet: boolean) {
  return [
    isMainnet ? ChainId.AVALANCHE_MAINNET_ID : ChainId.AVALANCHE_TESTNET_ID,
    ...getXPChainIds(isMainnet),
  ];
}
