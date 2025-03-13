import permissionsV2Migration from './permissions_v2';

describe('src/background/services/storage/schemaMigrations/migrations/permissions_v2', () => {
  const perms = {
    'core.app': {
      domain: 'core.app',
      accounts: {
        '0x123': true,
      },
    },
    'other.app': {
      domain: 'other.app',
      accounts: {
        '0x123': false,
      },
    },
  };

  it('properly validates current storage', () => {
    expect(
      permissionsV2Migration.previousSchema.validate({
        ...perms,
        version: 2,
      }).error?.message,
    ).toEqual(`"version" must be [1]`);

    expect(
      permissionsV2Migration.previousSchema.validate({
        'core.app': {
          domain: 'core.app',
          accounts: {},
        },
        version: 1,
      }),
    ).toEqual({
      value: { 'core.app': { domain: 'core.app', accounts: {} }, version: 1 },
    });

    expect(
      permissionsV2Migration.previousSchema.validate({
        'core.app': {},
        version: 1,
      }).error?.message,
    ).toEqual(`"core.app.domain" is required`);

    expect(
      permissionsV2Migration.previousSchema.validate({
        ...perms,
        version: 1,
      }),
    ).toEqual({
      value: {
        version: 1,
        ...perms,
      },
    });

    expect(
      permissionsV2Migration.previousSchema.validate({
        ...perms,
      }),
    ).toEqual({
      value: {
        ...perms,
      },
    });

    expect(
      permissionsV2Migration.previousSchema.validate({
        version: 1,
      }),
    ).toEqual({
      value: {
        version: 1,
      },
    });

    expect(permissionsV2Migration.previousSchema.validate({})).toEqual({
      value: {},
    });
  });

  it('properly migrates permissions', () => {
    expect(permissionsV2Migration.up(perms)).toEqual({
      'core.app': {
        domain: 'core.app',
        accounts: {
          '0x123': 'EVM',
        },
      },
      'other.app': {
        domain: 'other.app',
        accounts: {},
      },
      version: 2,
    });
  });
});
