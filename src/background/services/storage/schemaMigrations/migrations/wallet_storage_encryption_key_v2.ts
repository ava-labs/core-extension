import Joi from 'joi';

const VERSION = 2;

type PreviousSchema = string;

const previousSchema = Joi.string();

const up = async (storageKey: PreviousSchema) => {
  return {
    // No need to change the storageKey
    // We only want to trigger a re-save which will save the key with the updated key derviation algorithm
    storageKey,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
