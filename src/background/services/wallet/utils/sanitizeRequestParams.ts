import { _TypedDataEncoder, arrayify, hexlify } from 'ethers/lib/utils';
import { MessageType } from '../../messages/models';
import { BigNumber, TypedDataDomain } from 'ethers';
import { isValidAddress } from '@src/utils/isAddressValid';

type RequestParams = {
  data: any;
  from: string;
  password?: string;
};

type TypedData = {
  type: string;
  name: string;
  value: any;
};

type MessageTypeProperty = {
  name: string;
  type: string;
};

type MessageTypes = {
  EIP712Domain: MessageTypeProperty[];
  [additionalProperties: string]: MessageTypeProperty[];
};

enum KnownRequestDataType {
  ADDRESS = 'address',
  STRING = 'string',
  BOOL = 'bool',
  BYTES = 'bytes',
  UINT = 'uint',
  INT = 'int',
  UNKNOWN = 'unknown',
}

/**
 * From: https://github.com/MetaMask/eth-sig-util/blob/main/src/sign-typed-data.ts
 * @property types - The custom types used by this message.
 * @property primaryType - The type of the message.
 * @property domain - Signing domain metadata. The signing domain is the intended context for the
 * signature (e.g. the dapp, protocol, etc. that it's intended for). This data is used to
 * construct the domain seperator of the message.
 * @property domain.name - The name of the signing domain.
 * @property domain.version - The current major version of the signing domain.
 * @property domain.chainId - The chain ID of the signing domain.
 * @property domain.verifyingContract - The address of the contract that can verify the signature.
 * @property domain.salt - A disambiguating salt for the protocol.
 * @property message - The message to be signed.
 */
type TypedMessage = {
  types: MessageTypes;
  primaryType: keyof MessageTypes;
  domain: TypedDataDomain;
  message: Record<string, unknown>;
};

export const messageTypesNeedFiltering = [
  MessageType.SIGN_TYPED_DATA,
  MessageType.SIGN_TYPED_DATA_V1,
  MessageType.SIGN_TYPED_DATA_V3,
  MessageType.SIGN_TYPED_DATA_V4,
];

export function sanitizeRequestParams(
  messageType: MessageType,
  original: RequestParams
) {
  if (!messageTypesNeedFiltering.includes(messageType)) {
    return original;
  }

  const sanitizedData = sanitizeData(messageType, original.data);
  return {
    ...original,
    data: sanitizedData,
  };
}

/**
 * Removes properties from a message object that are not defined per EIP-712.
 *
 * @param data - The typed message object.
 * @returns The typed message object with only allowed fields.
 */
function sanitizeData(
  messageType: MessageType,
  data: TypedData[] | TypedMessage
) {
  if (
    messageType === MessageType.SIGN_TYPED_DATA ||
    messageType === MessageType.SIGN_TYPED_DATA_V1
  ) {
    return sanitizeArrayTypedData(data as TypedData[]);
  }
  // for  MessageType.SIGN_TYPED_DATA_V3 and  MessageType.SIGN_TYPED_DATA_V4,
  return sanitizeObjectTypedData(data as TypedMessage);
}

// This function will filter any TypedData that has type and type of the value not matching.
function sanitizeArrayTypedData(data: TypedData[]) {
  const filteredTypedData = validateAndFilterTypedData(data);

  const sanitizedArrayData: TypedData[] = [];

  filteredTypedData.forEach((typedData: TypedData) => {
    const sanitizedValue = isArrayType(typedData.type)
      ? sanitizeArrayValues(typedData.type, typedData.value)
      : sanitizeValue(typedData.type, typedData.value);

    if (sanitizedValue !== null) {
      sanitizedArrayData.push({
        ...typedData,
        value: sanitizedValue,
      });
    }
  });

  return sanitizedArrayData;
}

// This function will filter any key value from MessageTypes if they are not part of primaryType.
function sanitizeObjectTypedData(original: TypedMessage) {
  const { EIP712Domain, ...filtered } = filterUnusedTypes(original);

  if (Object.keys(filtered).length === 0) {
    throw new Error('Problem with types. Please review and try again');
  }
  /**
   * Ask Ethers to give us a filtered payload that only includes types specified in the `types` object.
   * This function expect EIP712Domain to be not included in types.
   */
  const filteredTypedDataPayload = _TypedDataEncoder.getPayload(
    original.domain,
    filtered,
    original.message
  );
  return {
    ...filteredTypedDataPayload,
    types: {
      // Re-add EIP712Domain into types
      ...(EIP712Domain === undefined ? {} : { EIP712Domain }),
      ...filteredTypedDataPayload.types,
    },
  };
}

/**
 * A member type can be either an atomic type, a dynamic type or a reference type.
 * The atomic types are bytes1 to bytes32, uint8 to uint256, int8 to int256, bool and address. These correspond to their definition in Solidity. Note that there are no aliases uint and int. Note that contract addresses are always plain address. Fixed point numbers are not supported by the standard. Future versions of this standard may add new atomic types.
 * The dynamic types are bytes and string. These are like the atomic types for the purposed of type declaration, but their treatment in encoding is different.
 * The reference types are arrays and structs. Arrays are either fixed size or dynamic and denoted by Type[n] or Type[] respectively. Structs are references to other structs by their name. The standard supports recursive struct types.
 */

function getKnownRequestDataType(typeName: string): KnownRequestDataType {
  switch (typeName) {
    case 'address':
      return KnownRequestDataType.ADDRESS;
    case 'string':
      return KnownRequestDataType.STRING;
    case 'bool':
      return KnownRequestDataType.BOOL;
    default:
      if (typeName.match(/^bytes(\d*)/)) {
        return KnownRequestDataType.BYTES;
      } else if (typeName.match(/^uint(\d*)/)) {
        return KnownRequestDataType.UINT;
      } else if (typeName.match(/^int(\d*)/)) {
        return KnownRequestDataType.INT;
      }
      return KnownRequestDataType.UNKNOWN;
  }
}

function sanitizeValue(type, value) {
  const typeToCheck = getKnownRequestDataType(type);

  switch (typeToCheck) {
    case KnownRequestDataType.ADDRESS:
      return value.toLowerCase();
    case KnownRequestDataType.STRING:
      return value;
    case KnownRequestDataType.BOOL:
      return !!value;
    case KnownRequestDataType.BYTES:
      return hexlify(arrayify(value));
    case KnownRequestDataType.INT:
    case KnownRequestDataType.UINT:
      return BigNumber.from(value).toString();
    default:
      return null;
  }
}

function isArrayType(typeName: string) {
  return typeName.includes('[') && typeName.endsWith(']');
}

function getTypeNameWithoutArray(typeName: string) {
  return typeName.slice(0, typeName.indexOf('['));
}

function sanitizeArrayValues(type: string, values: any[]) {
  const hasLendgthSpecified = type.match(/^[a-zA-Z0-9]+\[[0-9]+\]$/g);

  if (hasLendgthSpecified) {
    const length = type.substring(type.indexOf('[') + 1, type.lastIndexOf(']'));
    if (values.length !== Number(length)) {
      throw new Error(`Array length does not match for ${type}`);
    }
  }

  const typeToCheck = getTypeNameWithoutArray(type);
  return values.map((value) => {
    return sanitizeValue(typeToCheck, value);
  });
}

function doesValueMatchType(type: string, value: any) {
  const typeToCheck = getKnownRequestDataType(type);

  switch (typeToCheck) {
    case KnownRequestDataType.ADDRESS:
      return isValidAddress(value);

    case KnownRequestDataType.STRING:
      return isString(value);

    case KnownRequestDataType.BOOL:
      return isBoolean(value);

    case KnownRequestDataType.BYTES:
    case KnownRequestDataType.INT:
    case KnownRequestDataType.UINT:
      return isValidNumberType(type, value);
    default:
      return false;
  }
}

function validateAndFilterTypedData(data: TypedData[]) {
  return data.filter((typedData) => {
    // Handling non-array type
    if (!isArrayType(typedData.type)) {
      return doesValueMatchType(typedData.type, typedData.value);
    }

    // Handling array type
    if (!Array.isArray(typedData.value)) {
      return false;
    }
    const typeToCheck = getTypeNameWithoutArray(typedData.type);
    return typedData.value.every((value) =>
      doesValueMatchType(typeToCheck, value)
    );
  });
}

function isValidNumberType(type: string, value: any) {
  // handle non-array
  if (!isArrayType(type)) {
    return isValidNumber(type, value);
  }

  // handling array
  if (!Array.isArray(value)) {
    return false;
  }

  const typeToCheck = getTypeNameWithoutArray(type);

  return value.every((item) => isValidNumber(typeToCheck, item));
}

function isValidNumber(type: string, value: any) {
  if (Array.isArray(value) || isNaN(Number(value))) {
    return false;
  }
  const typeToCheck = getKnownRequestDataType(type);
  if (typeToCheck === KnownRequestDataType.BYTES) {
    try {
      hexlify(arrayify(value));
      return true;
    } catch {
      return false;
    }
  } else if (
    typeToCheck === KnownRequestDataType.UINT ||
    typeToCheck === KnownRequestDataType.INT
  ) {
    try {
      BigNumber.from(value);
      return true;
    } catch {
      return false;
    }
  } else {
    return false;
  }
}

function isString(value: any) {
  return typeof value === 'string' || value instanceof String;
}

function isBoolean(value: any) {
  return typeof value == 'boolean';
}

// This function is exported for testing purpose
export function filterUnusedTypes(
  original: TypedMessage
): Record<string, MessageTypeProperty[]> {
  const { EIP712Domain } = original.types;

  // If types include unused type, _TypedDataEncoder.getPayload throws an error. So we need to include only used types and EIP712Domain
  const primaryType = findPrimaryType(original);
  const otherUsedTypes = findUsedTypes(original.types, primaryType);

  // EIP712Domain is not a part of the message. But it is needed. So it is add to the returned object
  return {
    ...primaryType,
    ...otherUsedTypes,
    ...(EIP712Domain === undefined ? {} : { EIP712Domain }),
  };
}

function findPrimaryType(original: TypedMessage) {
  const primaryType = original.types[original.primaryType];

  if (!primaryType) {
    throw new Error('No matching type for primaryType found');
  }

  return { [original.primaryType]: primaryType };
}

function isKnownType(typeName: string) {
  const typeToCheck = getKnownRequestDataType(typeName);
  return typeToCheck !== KnownRequestDataType.UNKNOWN;
}

function findUsedTypes(
  types: MessageTypes,
  primaryType: { [key: string]: MessageTypeProperty[] }
) {
  const usedTypes: { [key: string]: MessageTypeProperty[] } = {};

  Object.values(primaryType).forEach((properties) => {
    properties.forEach((type) => {
      const typeToCheck = type.type.includes('[')
        ? getTypeNameWithoutArray(type.type)
        : type.type;
      // if it is a known type, we do not need to provide the type.
      if (isKnownType(typeToCheck)) {
        return;
      }

      const foundType = types[typeToCheck];

      if (!foundType) {
        throw Error(`Missing type: ${typeToCheck}`);
      }

      if (usedTypes[typeToCheck]) {
        return;
      }
      usedTypes[typeToCheck] = foundType;
      const foundTypes = findUsedTypes(types, { [type.type]: foundType });
      for (const [key, value] of Object.entries(foundTypes)) {
        usedTypes[key] = value;
      }
    });
  });

  return usedTypes;
}
