import { CustomRpcHeaders } from '@core/types';

const EMPTY_KEY_VALUE_HEADER: KeyValueHeader = {
  key: '',
  value: '',
};

export type KeyValueHeader = {
  key: string;
  value: string;
};

const convertToKeyValue = (headers: CustomRpcHeaders) => {
  return Object.entries(headers).map(([key, value]) => ({
    key,
    value,
  }));
};

export const getKeyValueHeaderList = (headers: CustomRpcHeaders) => {
  const list = convertToKeyValue(headers);

  list.push(EMPTY_KEY_VALUE_HEADER);

  return list;
};

export const updateKeyValueList = (
  original: KeyValueHeader[],
  newKeyValue: KeyValueHeader,
  index: number,
) => {
  const newList = [...original];

  if (newKeyValue.key === '' && newKeyValue.value === '') {
    // Both empty means deleting
    newList.splice(index, 1);
  } else {
    newList[index] = newKeyValue;
  }

  if (newList[newList.length - 1]?.key !== '') {
    newList.push(EMPTY_KEY_VALUE_HEADER);
  }

  return newList;
};

export const prepToStoreCustomRpcHeaders = (
  headers: KeyValueHeader[],
): CustomRpcHeaders => {
  return headers.reduce((acc, { key, value }) => {
    if (key !== '' || value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as CustomRpcHeaders);
};

const hasDuplicatesKey = (headers: KeyValueHeader[]) => {
  const keys = headers.map((header) => header.key).filter((key) => key !== '');
  return new Set(keys).size !== keys.length;
};

export const isReadyToStore = (headers: KeyValueHeader[]) => {
  const headerToValidate = [...headers];
  const lastItem = headerToValidate[headerToValidate.length - 1];

  if (lastItem && lastItem.key === '' && lastItem.value === '') {
    //Removing the empty new field
    headerToValidate.pop();
  }

  return (
    headerToValidate.every(({ key, value }) => key !== '' && value !== '') &&
    !hasDuplicatesKey(headerToValidate)
  );
};
