import type {
  CubeSignerResponse,
  SignerSessionData,
} from '@cubist-labs/cubesigner-sdk';
import { SignerSessionManager } from '@cubist-labs/cubesigner-sdk';
import { getSignerToken } from './getSignerToken';

const retrieveMock = jest.fn();

jest.mock('@cubist-labs/cubesigner-sdk', () => ({
  SignerSessionManager: {
    createFromSessionInfo: jest.fn().mockImplementation(() => {
      return {
        storage: { retrieve: retrieveMock },
      };
    }),
  },
  envs: { gamma: 'gamma' },
}));

jest.mock('@cubist-labs/cubesigner-sdk');

const sessionInfoMock = {
  org_id: 'orgId',
  session_info: {
    auth_token: 'auth_token',
    auth_token_exp: 1,
    epoch: 1,
    epoch_token: 'epoch_token',
    refresh_token: 'refresh_token',
    refresh_token_exp: 1,
    session_id: 'session_id',
  },
  token: 'token',
};

const mockedResponse = {
  data: jest.fn(),
} as unknown as CubeSignerResponse<SignerSessionData>;

describe('src/utils/seedless/getSignerToken', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      CUBESIGNER_ENV: 'gamma',
      SEEDLESS_ORG_ID: 'org_id',
    };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should create a session manager', async () => {
    (mockedResponse.data as unknown as jest.Mock).mockReturnValueOnce(
      sessionInfoMock,
    );

    await getSignerToken(mockedResponse);
    expect(mockedResponse.data).toHaveBeenCalled();
    expect(SignerSessionManager.createFromSessionInfo).toHaveBeenCalledWith(
      'gamma',
      'org_id',
      sessionInfoMock,
    );

    expect(retrieveMock).toHaveBeenCalled();
  });
});
