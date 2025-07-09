import { Avalanche } from '@avalabs/core-wallets-sdk';
import {
  AVALANCHE_BASE_DERIVATION_PATH,
  SecretType,
  DAppProviderRequest,
  DEFERRED_RESPONSE,
} from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { AvalancheGetAddressesInRangeHandler } from './avalanche_getAddressesInRange';
import { buildRpcCall } from '@shared/tests/test-utils';
import { canSkipApproval, KNOWN_CORE_DOMAINS } from '@core/common';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { AccountsService } from '../AccountsService';

jest.mock('@avalabs/core-wallets-sdk');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  canSkipApproval: jest.fn(),
}));
jest.mock('~/runtime/openApprovalWindow');

describe('background/services/accounts/handlers/avalanche_getAddressesInRange.ts', () => {
  const getPrimaryAccountSecretsMock = jest.fn();

  const secretsServiceMock = {
    getPrimaryAccountSecrets: getPrimaryAccountSecretsMock,
  } as any;

  const networkServiceMock = {
    getAvalanceProviderXP: jest.fn(),
  } as any;

  const accountsService = jest.mocked<AccountsService>({
    getActiveAccount: async () => undefined,
  } as any);

  const handleRequest = async (request) => {
    const handler = new AvalancheGetAddressesInRangeHandler(
      secretsServiceMock,
      networkServiceMock,
      accountsService,
    );

    return handler.handleAuthenticated(request);
  };

  const getPayload = (payload, domain = 'core.app') =>
    ({
      id: '1234',
      method: DAppProviderRequest.AVALANCHE_GET_ADDRESSES_IN_RANGE,
      site: {
        domain,
        tabId: 3,
      },
      ...payload,
    }) as const;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(canSkipApproval).mockResolvedValue(true);
  });

  describe('handleAuthenticated', () => {
    it('returns error on error', async () => {
      const error = new Error('some error');
      getPrimaryAccountSecretsMock.mockRejectedValueOnce(error);
      const request = getPayload({
        params: [0, 0, 10, 10],
      });

      const result = await handleRequest(buildRpcCall(request));
      expect(result).toEqual({
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: error.message,
        }),
      });
    });

    describe('mnemonic wallet', () => {
      const xpubXP = 'xpubXP';

      const getExpectedResult = (type: string, count: number) =>
        [...Array(count)].map((_, i) => `${type}_address${i}`);

      beforeEach(() => {
        getPrimaryAccountSecretsMock.mockResolvedValue({
          secretType: SecretType.Mnemonic,
          extendedPublicKeys: [
            {
              curve: 'secp256k1',
              derivationPath: AVALANCHE_BASE_DERIVATION_PATH,
              key: xpubXP,
            },
          ],
        });

        jest
          .mocked(Avalanche.getAddressFromXpub)
          .mockImplementation(
            (_, index, __, ___, isChange) =>
              `X-${isChange ? 'internal' : 'external'}_address${index}`,
          );
      });

      it('throws if external start index is incorrect', async () => {
        const { error } = await handleRequest(
          buildRpcCall(getPayload({ params: [-1, 0] })),
        );

        expect(error).toEqual(
          ethErrors.rpc.invalidParams({
            message: 'Invalid start index',
          }),
        );
      });

      it('throws if internal start index is incorrect', async () => {
        const { error } = await handleRequest(
          buildRpcCall(getPayload({ params: [0, -1] })),
        );
        expect(error).toEqual(
          ethErrors.rpc.invalidParams({
            message: 'Invalid start index',
          }),
        );
      });

      it('returns the address list correctly', async () => {
        const { result } = await handleRequest(
          buildRpcCall(getPayload({ params: [0, 0, 2, 2] })),
        );
        expect(result).toEqual({
          external: getExpectedResult('external', 2),
          internal: getExpectedResult('internal', 2),
        });
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(4);
      });

      it('asks for approval for non-Core dApps', async () => {
        jest.mocked(canSkipApproval).mockResolvedValueOnce(false);

        const request = getPayload({ params: [0, 0, 2, 2] });
        const { result } = await handleRequest(buildRpcCall(request));
        expect(result).toEqual(DEFERRED_RESPONSE);
        expect(openApprovalWindow).toHaveBeenCalledWith(
          expect.objectContaining({
            displayData: expect.objectContaining({
              indices: {
                internalStart: 0,
                internalLimit: 2,
                externalStart: 0,
                externalLimit: 2,
              },
              addresses: {
                external: getExpectedResult('external', 2),
                internal: getExpectedResult('internal', 2),
              },
            }),
          }),
          'getAddressesInRange',
        );
      });

      it('should call `canSkipApproval` with whitelisted domains', async () => {
        const EXPOSED_DOMAINS = [
          'develop.avacloud-app.pages.dev',
          'avacloud.io',
          'staging--ava-cloud.avacloud-app.pages.dev',
        ];
        const request = getPayload({ params: [0, 0, 2, 2] });
        await handleRequest(buildRpcCall(request));
        expect(canSkipApproval).toHaveBeenCalledWith('core.app', 3, {
          allowInactiveTabs: true,
          domainWhitelist: [...EXPOSED_DOMAINS, ...KNOWN_CORE_DOMAINS],
        });
      });

      it('sets the limit to 0 if not provided', async () => {
        const { result } = await handleRequest(
          buildRpcCall(getPayload({ params: [0, 0] })),
        );
        expect(result).toStrictEqual({
          external: [],
          internal: [],
        });
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(0);
      });

      it('sets the limit to 100 if the provided is over 100', async () => {
        const { result } = await handleRequest(
          buildRpcCall(getPayload({ params: [0, 0, 1000, 1000] })),
        );
        expect(result.external).toHaveLength(100);
        expect(result.internal).toHaveLength(100);
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(200);
      });
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new AvalancheGetAddressesInRangeHandler(
      secretsServiceMock,
      networkServiceMock,
      accountsService,
    );
    const request = getPayload({
      params: [0, 0, 10, 10],
    });

    const result = await handler.handleUnauthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: ethErrors.provider.unauthorized(),
    });
  });
});
