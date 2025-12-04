jest.mock('~/api-clients', () => ({
  profileApiClient: jest.fn(),
  balanceApiClient: jest.fn(),
  callGetAddresses: jest.fn(),
}));
jest.mock('~/api-clients/profile-api', () => ({
  postV1GetAddresses: jest.fn(),
}));
jest.mock('~/api-clients/balance-api', () => ({
  postV1BalanceGetBalances: jest.fn(),
}));
