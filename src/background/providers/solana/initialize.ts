import { registerWallet } from './register';
import { CoreWallet } from './wallet';
import type { Core } from './window';

export function initialize(core: Core): void {
  registerWallet(new CoreWallet(core));
}
