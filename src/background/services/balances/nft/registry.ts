import { registry } from 'tsyringe';
import { NFTBalancesServiceCovalent } from './NFTBalancesServiceCovalent';
import { NFTBalancesServiceGlacier } from './NFTBalancesServiceGlacier';

@registry([
  { token: 'NFTService', useToken: NFTBalancesServiceGlacier },
  { token: 'NFTService', useToken: NFTBalancesServiceCovalent },
])
export class NFTAggregatorRegistry {}
