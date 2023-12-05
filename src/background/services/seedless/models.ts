export class CoreApiError extends Error {}

export enum SeedlessEvents {
  TokenExpired = 'token-expired',
  TokenRefreshed = 'token-refreshed',
}
