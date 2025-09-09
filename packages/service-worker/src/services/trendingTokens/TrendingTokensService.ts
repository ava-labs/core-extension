import { singleton } from 'tsyringe';
import { trendingTokensSchema } from '@core/types';

@singleton()
export class TrendingTokenService {
  constructor() {}

  async getTrendingTokens() {
    const response = await fetch(`${process.env.PROXY_URL}/watchlist/trending`);
    const data = await response.json();

    const parsed = trendingTokensSchema.parse(data);
    return parsed
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 10)
      .map((token, index) => ({
        ...token,
        rank: index + 1,
      }));
  }
}
