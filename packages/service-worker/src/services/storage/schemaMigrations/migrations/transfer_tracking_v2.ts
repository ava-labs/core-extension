import { rpcErrors } from '@metamask/rpc-errors';

import { CommonError } from '@core/types';
import { Transfer } from '@avalabs/fusion-sdk';
import Joi from 'joi';

type LegacySchema = {
  trackedTransfers: Record<Transfer['id'], Transfer>;
};
type NewSchema = {
  trackedTransfers: Record<
    Transfer['id'],
    {
      transfer: Transfer;
      isRead: boolean;
    }
  >;
  version: 2;
};

const previousSchema = Joi.object<LegacySchema, true>({
  trackedTransfers: Joi.object().pattern(
    Joi.string(),
    Joi.object().unknown(true),
  ),
}).unknown(true);

const up = async (trackingState: LegacySchema): Promise<NewSchema> => {
  const validationResult = previousSchema.validate(trackingState);

  if (validationResult.error) {
    throw rpcErrors.internal({
      data: {
        reason: CommonError.MigrationFailed,
        context: validationResult.error.message,
      },
    });
  }

  const newTrackedTransfers: NewSchema['trackedTransfers'] = {};

  for (const transfer of Object.values(trackingState.trackedTransfers)) {
    newTrackedTransfers[transfer.id] = {
      transfer,
      isRead: false,
    };
  }

  return {
    trackedTransfers: newTrackedTransfers,
    version: 2,
  };
};

export default {
  previousSchema,
  up,
};
