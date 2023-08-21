import SignClient from '@walletconnect/sign-client';
import { Core } from '@walletconnect/core';

import { WalletConnectService } from './WalletConnectService';
import { WalletConnectStorage } from './WalletConnectStorage';
import {
  WALLET_CONNECT_APP_METADATA,
  WalletConnectErrorCode,
  WalletConnectEvent,
} from './models';
import { mockedSession } from './__fixtures__/session';
import { SessionTypes } from '@walletconnect/types';

jest.mock('@walletconnect/sign-client');

describe('src/background/services/walletConnect/WalletConnectService.ts', () => {
  const fakeStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    getEntries: jest.fn(),
    removeItem: jest.fn(),
    getKeys: jest.fn(),
  } as unknown as WalletConnectStorage;

  type ClientMockOptions = {
    connect?: {
      isSuccess: boolean;
      response: any;
    };
    session?: {
      getAll?: () => SessionTypes.Struct[];
    };
  };
  const mockClient = ({ connect, session }: ClientMockOptions = {}) => {
    const client = {
      on: jest.fn(),
      session: {
        delete: jest.fn(),
        getAll: jest.fn().mockReturnValue([]),
      },
    } as unknown as SignClient;

    // Mock .connect() method if specified
    if (connect) {
      const { isSuccess, response } = connect;

      Object.assign(client, {
        connect: jest.fn().mockImplementation(async () => {
          if (isSuccess) {
            return response;
          }

          throw new Error(response);
        }),
      });
    }

    if (session) {
      Object.assign(client.session, session);
    }

    jest.mocked(SignClient.init).mockResolvedValue(client);

    return client;
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lazily initializes when the first request comes in', async () => {
    mockClient({
      connect: {
        isSuccess: true,
        response: {
          uri: 'dummy-uri',
          approval: () => Promise.resolve(mockedSession),
        },
      },
    });

    const service = new WalletConnectService(fakeStorage);

    expect(SignClient.init).not.toHaveBeenCalled();

    await service.connect({ chainId: 1 });

    expect(SignClient.init).toHaveBeenCalledWith({
      metadata: WALLET_CONNECT_APP_METADATA,
      core: expect.any(Core),
    });
  });

  describe('.connect()', () => {
    describe('during a happy path', () => {
      const tabId = 1234;
      let service: WalletConnectService;
      let client: SignClient;

      beforeEach(async () => {
        client = mockClient({
          connect: {
            isSuccess: true,
            response: {
              uri: 'dummy-uri',
              approval: () => Promise.resolve(mockedSession),
            },
          },
        });
        service = new WalletConnectService(fakeStorage);
      });

      it('correctly builds the session proposal', async () => {
        await service.connect({ chainId: 1337 });

        expect(client.connect).toHaveBeenCalledWith({
          requiredNamespaces: {
            eip155: expect.objectContaining({
              chains: ['eip155:1337'],
            }),
          },
        });
      });

      it(`emits a "${WalletConnectEvent.UriGenerated}" event`, async () => {
        service.addListener(WalletConnectEvent.UriGenerated, (event) => {
          expect(event).toEqual({
            uri: 'dummy-uri',
            tabId,
          });
        });

        await service.connect({ chainId: 1, tabId });
      });

      it('returns the obtained address', async () => {
        const expectedAddress =
          mockedSession.namespaces.eip155.accounts[0]?.split(':')[2];

        expect(await service.connect({ chainId: 1, tabId })).toEqual(
          expectedAddress
        );
      });
    });

    describe('when the session proposal times out', () => {
      let service: WalletConnectService;

      beforeEach(async () => {
        mockClient({
          connect: {
            isSuccess: true,
            response: {
              uri: 'dummy-uri',
              approval: () => {
                throw new Error('Proposal expired');
              },
            },
          },
        });
        service = new WalletConnectService(fakeStorage);
      });

      it('throws an error with correct code', (done) => {
        service
          .connect({ chainId: 1234 })
          .catch((err) => {
            expect(err.code).toEqual(WalletConnectErrorCode.ProposalExpired);
          })
          .finally(done);
      });
    });

    describe('when the obtained account address does not match the expected one', () => {
      let service: WalletConnectService;
      let client: SignClient;

      beforeEach(async () => {
        client = mockClient({
          connect: {
            isSuccess: true,
            response: {
              uri: 'dummy-uri',
              approval: () => Promise.resolve(mockedSession),
            },
          },
        });
        service = new WalletConnectService(fakeStorage);
      });

      it('throws an error with correct code', (done) => {
        service
          .connect({
            chainId: 1,
            tabId: 1234,
            reconnectionAddress: 'some-dummy-incorrect-address',
          })
          .catch((err) => {
            expect(err.code).toEqual(WalletConnectErrorCode.IncorrectAddress);
          })
          .finally(done);
      });

      it('deletes the session object', (done) => {
        service
          .connect({
            chainId: 1,
            tabId: 1234,
            reconnectionAddress: 'some-dummy-incorrect-address',
          })
          .catch(() => {
            // noop
          })
          .finally(() => {
            expect(client.session.delete).toHaveBeenCalledWith(
              mockedSession.topic,
              expect.anything()
            );
            done();
          });
      });
    });

    describe('when the session object does not contain the account information', () => {
      let service: WalletConnectService;

      beforeEach(async () => {
        mockClient({
          connect: {
            isSuccess: true,
            response: {
              uri: 'dummy-uri',
              approval: () =>
                Promise.resolve({
                  namespaces: {
                    eip155: {
                      accounts: [],
                    },
                  },
                }),
            },
          },
        });
        service = new WalletConnectService(fakeStorage);
      });

      it('throws an error with correct code', (done) => {
        service
          .connect({
            chainId: 1,
            tabId: 1234,
            reconnectionAddress: 'some-dummy-incorrect-address',
          })
          .catch((err) => {
            expect(err.code).toEqual(
              WalletConnectErrorCode.NoAccountsConnected
            );
          })
          .finally(done);
      });
    });
  });

  describe('.getAccountInfo', () => {
    let service: WalletConnectService;

    beforeEach(async () => {
      mockClient({
        session: {
          getAll: jest.fn().mockReturnValue([mockedSession]),
        },
      });

      service = new WalletConnectService(fakeStorage);
    });

    describe('when the session object is found', () => {
      const mockedAddress = '0xdDd288FAe290d498B9513f4BAc4a8Fc9a3Ce112d';

      it('extracts information for the account', async () => {
        const result = await service.getAccountInfo(mockedAddress);

        expect(result).toEqual({
          address: mockedAddress,
          chains: [43114, 43113, 1, 5],
          walletApp: expect.objectContaining({
            description: expect.any(String),
            icons: expect.arrayContaining([expect.any(String)]),
            name: expect.any(String),
            url: expect.any(String),
          }),
        });
      });
    });
  });
});
