import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { Account } from '../../accounts/models';
import { TokenWithBalance } from '../models';

export type BalanceEmitter = (
  networkId: number,
  value: Record<string, TokenWithBalance[]>
) => void;
export interface onBalanceUpdate {
  vmType: NetworkVMType;
  onUpdate(
    accounts: Account[],
    emitter: BalanceEmitter,
    customNetworks?: Network[]
  ): void;
}
