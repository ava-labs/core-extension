import { registry } from 'tsyringe';
import { BtcBalanceEmitter } from './btcBalanceEmitter';
import { SubnetBalanceEmitter } from './subnetBalanceEmitter';

@registry([
  { token: 'NetworkBalanceEmitter', useToken: BtcBalanceEmitter },
  { token: 'NetworkBalanceEmitter', useToken: SubnetBalanceEmitter },
])
export class NetworkBalanceRegistry {}
