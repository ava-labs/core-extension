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

/**
 * SECURITY: EIP-712 encoders (both `@metamask/eth-sig-util` and ethers) coerce
 * whatever they are given for a `bool` field with plain JS truthiness, so the
 * string `"false"` encodes as `true`. The approval screen renders the original
 * value, so a dApp can have the user review `allowed: false` while the wallet
 * signs `allowed: true` - the opposite authority state for a DAI-style permit.
 *
 * A dApp has no legitimate reason to send anything but a real boolean for a
 * `bool` field, so reject the coercion instead of letting the displayed and
 * signed values drift apart.
 */
const assertBooleansAreNotCoerced = (
  types: TypedMessage['types'],
  structType: string,
  value: unknown,
  path: string[] = [],
  seen: Set<string> = new Set(),
): void => {
  const fields = types[structType];

  if (!Array.isArray(fields) || !value || typeof value !== 'object') {
    return;
  }

  // Types may reference each other; only walk each struct once per path.
  const pathKey = `${path.join('.')}:${structType}`;
  if (seen.has(pathKey)) {
    return;
  }
  seen.add(pathKey);

  for (const field of fields) {
    if (!field || typeof field !== 'object') {
      continue;
    }

    const { name, type } = field as { name?: unknown; type?: unknown };

    if (typeof name !== 'string' || typeof type !== 'string') {
      continue;
    }

    const fieldValue = (value as Record<string, unknown>)[name];

    if (fieldValue === undefined || fieldValue === null) {
      continue;
    }

    const arrayMatch = type.match(/^(.*?)(\[\d*\])+$/);
    const baseType = arrayMatch ? arrayMatch[1] : type;
    const entries = arrayMatch
      ? Array.isArray(fieldValue)
        ? fieldValue
        : []
      : [fieldValue];

    for (const [index, entry] of entries.entries()) {
      const entryPath = arrayMatch
        ? [...path, `${name}[${index}]`]
        : [...path, name];

      if (baseType === 'bool') {
        if (typeof entry !== 'boolean') {
          throw new Error(
            `Invalid typed data: "${entryPath.join(
              '.',
            )}" is declared as bool but is not a boolean`,
          );
        }
      } else if (baseType && baseType in types) {
        assertBooleansAreNotCoerced(types, baseType, entry, entryPath, seen);
      }
    }
  }
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
  data: unknown,
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

    const { types, primaryType, message } = validationResult.value;
    assertBooleansAreNotCoerced(types, primaryType, message);
  }
};

export default ensureMessageFormatIsValid;
