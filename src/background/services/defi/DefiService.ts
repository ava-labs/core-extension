import { singleton } from 'tsyringe';

import { DebankService } from './debank';
import { DefiPortfolio, DefiProtocol } from './models';

@singleton()
export class DefiService {
  constructor(private debankService: DebankService) {}

  async getUserPortfolio(address: string): Promise<DefiPortfolio> {
    try {
      const protocols = await this.debankService.getUserProtocols(address);

      return {
        protocols: this.#sortProtocols(protocols),
        totalUsdValue: this.#calculateTotalValueOfUserProtocols(protocols),
      };
    } catch (err) {
      throw new Error(
        `DefiService: Unable to fetch user's portfolio: ${
          err instanceof Error ? err.message : err
        }`
      );
    }
  }

  #calculateTotalValueOfUserProtocols(protocols: DefiProtocol[]): number {
    return protocols.reduce(
      (total, { totalUsdValue }) => total + totalUsdValue,
      0
    );
  }

  #sortProtocols(protocols: DefiProtocol[]): DefiProtocol[] {
    return [...protocols].sort(
      ({ totalUsdValue: valueA }, { totalUsdValue: valueB }) => valueB - valueA
    );
  }
}
