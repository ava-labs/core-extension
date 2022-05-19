import {
  ActiveNetwork,
  NetworkVM,
} from '@src/background/services/network/models';

export function isBitcoin(network?: ActiveNetwork) {
  return network?.vm === NetworkVM.BITCOIN;
}
