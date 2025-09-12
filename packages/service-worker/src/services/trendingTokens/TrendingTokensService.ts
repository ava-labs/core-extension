import { singleton } from 'tsyringe';
import {
  TrendingToken,
  TrendingTokensNetwork,
  trendingTokensSchema,
} from '@core/types';

type TrendingTokensByNetwork = {
  tokens: TrendingToken[];
  lastFetched: Date | null;
  fetching: boolean;
};

type TrendingTokens = {
  avalanche: TrendingTokensByNetwork;
  solana: TrendingTokensByNetwork;
};

@singleton()
export class TrendingTokenService {
  constructor() {}

  private _trendingTokens: TrendingTokens = {
    avalanche: {
      tokens: [],
      lastFetched: null,
      fetching: false,
    },
    solana: {
      tokens: [],
      lastFetched: null,
      fetching: false,
    },
  };

  get trendingTokensInCache() {
    return {
      avalanche: this._trendingTokens.avalanche.tokens,
      solana: this._trendingTokens.solana.tokens,
    };
  }

  set updateTrendingTokens({
    tokens,
    network,
  }: {
    tokens: TrendingToken[];
    network: TrendingTokensNetwork;
  }) {
    this._trendingTokens[network].tokens = tokens;
    this._trendingTokens[network].lastFetched = new Date();
  }

  get lastFetched() {
    return {
      avalanche: this._trendingTokens.avalanche.lastFetched,
      solana: this._trendingTokens.solana.lastFetched,
    };
  }

  get fetching() {
    return {
      avalanche: this._trendingTokens.avalanche.fetching,
      solana: this._trendingTokens.solana.fetching,
    };
  }

  set updateFetching({
    network,
    fetching,
  }: {
    network: TrendingTokensNetwork;
    fetching: boolean;
  }) {
    this._trendingTokens[network].fetching = fetching;
  }

  private shouldFetchTrendingTokens(network: TrendingTokensNetwork) {
    return (
      this.lastFetched[network] === null ||
      (!this.fetching[network] &&
        this.lastFetched[network].getTime() + 1000 * 60 * 10 < Date.now()) // 10 minutes
    );
  }

  private async getTrendingTokensFromCache(network: TrendingTokensNetwork) {
    return this.trendingTokensInCache[network];
  }

  async getTrendingTokens(network: TrendingTokensNetwork) {
    if (!this.shouldFetchTrendingTokens(network)) {
      return this.getTrendingTokensFromCache(network);
    }
    try {
      this.updateFetching = {
        network,
        fetching: true,
      };
      const searchParams = new URLSearchParams();
      searchParams.set('network', network);
      const response = await fetch(
        `${process.env.PROXY_URL}/watchlist/trending?${searchParams}`,
      );
      const data = await response.json();

      const parsed = trendingTokensSchema.parse(data);
      const sorted = parsed
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 10)
        .map((token, index) => ({
          ...token,
          rank: index + 1,
        }));

      this.updateTrendingTokens = {
        tokens: sorted,
        network,
      };
      this.updateFetching = {
        network,
        fetching: false,
      };
      return sorted;
    } catch (error) {
      this.updateFetching = {
        network,
        fetching: false,
      };
      throw error;
    }
  }
}
