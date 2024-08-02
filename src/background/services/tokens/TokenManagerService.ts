import {
  Network,
  NetworkContractToken,
  NetworkVMType,
} from '@avalabs/core-chains-sdk';
import { ethers } from 'ethers';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { SettingsService } from '../settings/SettingsService';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import xss from 'xss';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { EnsureDefined } from '@src/background/models';

@singleton()
export class TokenManagerService {
  constructor(
    private settingsService: SettingsService,
    private networkService: NetworkService
  ) {}

  async getCustomTokensForNetwork(
    network: Network
  ): Promise<NetworkContractToken[]> {
    const settings = await this.settingsService.getSettings();
    return Object.values(settings.customTokens[network.chainId] || {}) || [];
  }

  async getTokensByChainId(chainId: number): Promise<NetworkContractToken[]> {
    const network = await this.networkService.getNetwork(chainId);
    return network?.tokens ?? [];
  }

  async getTokenData(
    tokenAddress: string,
    network: Network
  ): Promise<EnsureDefined<NetworkContractToken, 'chainId'> | null> {
    if (!network || network.vmName !== NetworkVMType.EVM) {
      throw new Error('No network');
    }

    const provider = await getProviderForNetwork(network);
    if (!provider || !(provider instanceof JsonRpcBatchInternal)) {
      throw new Error('No provider');
    }

    const contract = new ethers.Contract(tokenAddress, ERC20.abi, provider);

    const contractCalls = await Promise.all([
      contract.name?.(),
      contract.symbol?.(),
      contract.decimals?.(),
    ]);
    // Purify the values for XSS protection
    const name = xss(contractCalls[0]);
    const symbol = xss(contractCalls[1]);
    const decimals = parseInt(contractCalls[2]);

    return {
      name,
      chainId: network.chainId,
      symbol,
      decimals,
      address: tokenAddress,
      contractType: 'ERC-20',
    };
  }
}
