import { caip2 } from '@avalabs/bridge-unified';

export const chainIdToCaip = (chainId: number, namespace = 'eip155') => {
  return caip2.toString({ namespace, reference: chainId.toString() });
};

export const caipToChainId = (identifier: string) => {
  return parseInt(caip2.toJSON(identifier).reference);
};
