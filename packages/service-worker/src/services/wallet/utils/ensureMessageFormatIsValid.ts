import Joi from 'joi';
import {
  isMessageSigningMethod,
  MessageSigningMethod,
  MessageType,
} from '@core/types';
import { rpcMethodToMessageType } from './rpcMethodToMessageType';

type TypedMessage = {
  types: {
    EIP712Domain: unknown;
  } & Record<string, unknown>;
  primaryType: string;
  domain: {
    name?: string;
    version?: string;
    chainId?: number | string;
    verifyingContract?: string;
    salt?: ArrayBuffer;
  };
  message: Record<string, unknown>;
};

// https://eips.ethereum.org/EIPS/eip-712#specification-of-the-eth_signtypeddata-json-rpc
const TYPED_MESSAGE_SCHEMA = Joi.object<TypedMessage>({
  types: Joi.object({
    EIP712Domain: Joi.array().required(),
  })
    .unknown(true)
    .required(),
  primaryType: Joi.string().required(),
  domain: Joi.object().required(),
  message: Joi.object().required(),
}).required();

const ensureMessageFormatIsValid = (
  messageType: MessageType | MessageSigningMethod,
  data: Record<string, unknown>,
  activeChainId: number,
) => {
  const normalized = isMessageSigningMethod(messageType)
    ? rpcMethodToMessageType(messageType)
    : messageType;
  if (
    normalized === MessageType.SIGN_TYPED_DATA_V3 ||
    normalized === MessageType.SIGN_TYPED_DATA_V4
  ) {
    const validationResult = TYPED_MESSAGE_SCHEMA.validate(data);

    if (validationResult.error) {
      throw validationResult.error;
    }

    // chainId can be hexadecimal string or decimal number
    const chainId = Number(validationResult.value.domain.chainId);

    if (chainId !== activeChainId) {
      throw new Error('target chainId does not match the currently active one');
    }
  }
};

export default ensureMessageFormatIsValid;
