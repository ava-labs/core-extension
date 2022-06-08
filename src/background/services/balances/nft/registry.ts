import { registry } from 'tsyringe';
import { NFTBalancesServiceCChain } from './NFTBalancesServiceCChain';

@registry([{ token: 'NFTService', useToken: NFTBalancesServiceCChain }])
export class NFTAggregatorRegistry {}
