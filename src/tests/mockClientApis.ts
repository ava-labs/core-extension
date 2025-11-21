jest.mock('~/api-clients', () => ({
  profileApiClient: jest.fn(),
  callGetAddresses: jest.fn(),
}));
jest.mock('~/api-clients/profile-api', () => ({
  postV1GetAddresses: jest.fn(),
}));
