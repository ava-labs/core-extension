import { getPermissionsConvertedToMetaMaskStructure } from './getPermissionsConvertedToMetaMaskStructure';

describe('background/services/permissions/utils/getPermissionConvertedToMetaMaskStructure', () => {
  const mockPermissions = {
    'example.com': {
      domain: 'example.com',
      accounts: {
        '123': false,
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': true,
      },
    },
  };

  it('returns empty array if there is no addressC, domain, or permissions', () => {
    expect(getPermissionsConvertedToMetaMaskStructure()).toStrictEqual([]);
    expect(
      getPermissionsConvertedToMetaMaskStructure('123', undefined, {}),
    ).toStrictEqual([]);
    expect(
      getPermissionsConvertedToMetaMaskStructure(undefined, 'example.com', {}),
    ).toStrictEqual([]);
    expect(
      getPermissionsConvertedToMetaMaskStructure(
        '123',
        'example.com',
        undefined,
      ),
    ).toStrictEqual([]);
    expect(
      getPermissionsConvertedToMetaMaskStructure('123', 'example.com'),
    ).toStrictEqual([]);
    expect(getPermissionsConvertedToMetaMaskStructure('123')).toStrictEqual([]);
  });

  it('returns empty array if there are no account permissions', () => {
    expect(
      getPermissionsConvertedToMetaMaskStructure(
        '123',
        'example.com',
        mockPermissions,
      ),
    ).toStrictEqual([]);
  });

  it('returns correct array if there are account permissions', () => {
    expect(
      getPermissionsConvertedToMetaMaskStructure(
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'example.com',
        mockPermissions,
      ),
    ).toEqual([{ invoker: 'example.com', parentCapability: 'accounts' }]);
  });
});
