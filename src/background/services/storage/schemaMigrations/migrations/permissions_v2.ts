import Joi from 'joi';
import { rpcErrors } from '@metamask/rpc-errors';

import { CommonError } from '@src/utils/errors';

const VERSION = 2 as const;

type LegacySchema = Record<
  string,
  {
    domain: string;
    accounts: {
      [addressC: string]: boolean;
    };
  }
>;

const previousSchema = Joi.object<LegacySchema>({
  version: Joi.number().valid(1),
}).pattern(
  Joi.string().not('version'),
  Joi.object({
    domain: Joi.string().required(),
    accounts: Joi.object().pattern(Joi.string(), Joi.boolean().required()),
  }),
);

type NewSchema = Record<
  string,
  {
    domain: string;
    accounts: {
      [address: string]: 'EVM'; // At the moment of writing this migration, we only stored permissions for EVM addresses
    };
  }
>;

const up = (legacyPermissions) => {
  const validationResult = previousSchema.validate(legacyPermissions);

  if (validationResult.error) {
    throw rpcErrors.internal({
      data: {
        reason: CommonError.MigrationFailed,
        context: validationResult.error.message,
      },
    });
  }

  const newPermissions = Object.entries(validationResult.value).reduce(
    (permAcc, [domain, { domain: _, accounts }]) => {
      permAcc[domain] = {
        domain,
        accounts: Object.entries(accounts).reduce(
          (accountsAcc, [addressC, hasAccess]) => {
            if (hasAccess) {
              accountsAcc[addressC] = 'EVM';
            }
            return accountsAcc;
          },
          {} as NewSchema[string]['accounts'],
        ),
      };
      return permAcc;
    },
    {} as NewSchema,
  );

  return {
    ...newPermissions,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
