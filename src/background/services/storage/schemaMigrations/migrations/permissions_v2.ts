import Joi from 'joi';

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

const previousSchema = Joi.object<LegacySchema>().pattern(
  Joi.string(),
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

const up = (legacyPermissions: LegacySchema) => {
  const newPermissions = Object.entries(legacyPermissions).reduce(
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
