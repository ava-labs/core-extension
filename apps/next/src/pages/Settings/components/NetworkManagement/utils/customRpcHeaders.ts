import { CustomRpcHeaders } from '@core/types';

const EMPTY_KEY_VALUE_HEADER: KeyValueHeader = {
  key: '',
  value: '',
  isNew: true,
  isDirty: false,
};

export type KeyValueHeader = {
  key: string;
  value: string;
  isNew: boolean;
  isDirty: boolean;
};

const convertToKeyValue = (headers: CustomRpcHeaders) => {
  return Object.entries(headers).map(([key, value]) => ({
    key,
    value,
    isNew: false,
    isDirty: false,
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

  newList[index] = newKeyValue;

  if (newList[newList.length - 1]?.key !== '') {
    newList.push(EMPTY_KEY_VALUE_HEADER);
  }

  return newList;
};
