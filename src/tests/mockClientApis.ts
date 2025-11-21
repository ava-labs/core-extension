jest.mock('~/api-clients', () => ({
  profileApiClient: jest.fn(),
}));
jest.mock('~/api-clients/profile-api', () => ({
  postV1GetAddresses: jest.fn(),
}));
