import Joi from 'joi';
import {
  EncodedFIDOAuthenticationResult,
  EncodedFIDORegistrationResult,
  FIDOApiEndpoint,
} from './types';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@avalabs/core-ext-common/src/monitoring/sentryCaptureException';

const REGISTRATION_RESPONSE_SCHEMA = Joi.object<
  EncodedFIDORegistrationResult,
  true
>({
  id: Joi.string().required(),
  rawId: Joi.string().required(),
  type: Joi.string(),
  response: Joi.object<EncodedFIDORegistrationResult['response'], true>({
    attestationObject: Joi.string().required(),
    clientDataJSON: Joi.string().required(),
  }).unknown(true),
}).unknown(true);

const AUTHENTICATION_RESPONSE_SCHEMA = Joi.object<
  EncodedFIDOAuthenticationResult,
  true
>({
  id: Joi.string().required(),
  rawId: Joi.string().required(),
  type: Joi.string(),
  response: Joi.object<EncodedFIDOAuthenticationResult['response'], true>({
    authenticatorData: Joi.string().required(),
    clientDataJSON: Joi.string().required(),
    signature: Joi.string().required(),
    userHandle: Joi.string().allow(null),
  }).unknown(true),
}).unknown(true);

export const isValidResponse = (
  endpoint: FIDOApiEndpoint,
  response: unknown,
) => {
  // The schemas allow additional properties to be defined,
  // but we care about the ones that are specified in the schema.
  const schema =
    endpoint === FIDOApiEndpoint.Authenticate
      ? AUTHENTICATION_RESPONSE_SCHEMA
      : REGISTRATION_RESPONSE_SCHEMA;
  const { error } = schema.validate(response);

  if (error) {
    const messages = error.details.map(({ message }) => message);
    sentryCaptureException(
      new Error(`Invalid Identity API response: ${messages.join(' | ')}`),
      SentryExceptionTypes.SEEDLESS,
    );

    return false;
  }

  return true;
};
