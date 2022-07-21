import { registry } from 'tsyringe';
import { NFTBalancesServiceCovalent } from './NFTBalancesServiceCovalent';

@registry([{ token: 'NFTService', useToken: NFTBalancesServiceCovalent }])
export class NFTAggregatorRegistry {}
