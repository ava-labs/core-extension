import { registry } from 'tsyringe';
import { CovalentNFTService } from './CovalentNFTService';

@registry([{ token: 'NFTAggregatorService', useToken: CovalentNFTService }])
export class NFTAggregatorRegistry {}
