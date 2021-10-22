import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { GasPrice } from '../../gas/models';
import { TransactionEvent } from './models';

export function gasPriceTransactionUpdateListener(
  evt: ExtensionConnectionEvent<GasPrice>
) {
  return evt?.name === TransactionEvent.GAS_PRICE_UPDATE;
}
