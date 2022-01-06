import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { GasPrice } from '../../gas/models';
import { SwapEvent } from './models';

export function gasPriceSwapUpdateListener(
  evt: ExtensionConnectionEvent<GasPrice>
) {
  return evt?.name === SwapEvent.GAS_PRICE_UPDATE;
}
