import { MessageType } from '@core/types';
import { paramsToMessageParams } from './messageParamsParser';

describe('src/background/services/messages/utils/messageParamsParser.ts', () => {
  const password = 'test password';
  const from = 'fromAddressString';
  const paramData = {
    hello: 'goodbye',
  };
  const typedDataString =
    '{"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}]}';

  const typedData = {
    Person: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'wallet',
        type: 'address',
      },
    ],
  };
  it('Should parse params with type: MessageType.PERSONAL_SIGN', () => {
    const params = [paramData, from, password];
    const data = {
      params,
      method: MessageType.PERSONAL_SIGN,
      id: '1',
    };
    const result = paramsToMessageParams(data);
    expect(result).toEqual({
      data: paramData,
      from,
      password,
    });
  });

  it('Should parse params with type: MessageType.SIGN_TYPED_DATA and get "from" value from 0th index', () => {
    const params = [from, [paramData]];
    const data = {
      params,
      method: MessageType.SIGN_TYPED_DATA,
      id: '1',
    };
    const result = paramsToMessageParams(data);
    expect(result).toEqual({
      data: [paramData],
      from,
    });
  });

  it('Should parse params with type: MessageType.SIGN_TYPED_DATA and get "from" value from 1st index', () => {
    const params = [[paramData], from];
    const data = {
      params,
      method: MessageType.SIGN_TYPED_DATA,
      id: '1',
    };
    const result = paramsToMessageParams(data);
    expect(result).toEqual({
      data: [paramData],
      from,
    });
  });

  it('Should parse params with type: MessageType.SIGN_TYPED_DATA_V1 and get "from" value from 0th index', () => {
    const params = [from, [paramData]];
    const data = {
      params,
      method: MessageType.SIGN_TYPED_DATA_V1,
      id: '1',
    };
    const result = paramsToMessageParams(data);
    expect(result).toEqual({
      data: [paramData],
      from,
    });
  });

  it('Should parse params with type: MessageType.SIGN_TYPED_DATA_V1 and get "from" value from 1st index', () => {
    const params = [[paramData], from];
    const data = {
      params,
      method: MessageType.SIGN_TYPED_DATA_V1,
      id: '1',
    };
    const result = paramsToMessageParams(data);
    expect(result).toEqual({
      data: [paramData],
      from,
    });
  });

  it('Should parse params with type: MessageType.ETH_SIGN', () => {
    const params = [from, paramData];
    const data = {
      params,
      method: MessageType.ETH_SIGN,
      id: '1',
    };
    const result = paramsToMessageParams(data);
    expect(result).toEqual({
      data: paramData,
      from,
    });
  });

  it('Should parse params with type: MessageType.SIGN_TYPED_DATA_V3', () => {
    const params = [from, typedDataString];
    const data = {
      params,
      method: MessageType.SIGN_TYPED_DATA_V3,
      id: '1',
    };
    const result = paramsToMessageParams(data);
    expect(result).toEqual({
      data: typedData,
      from,
    });
  });

  it('Should parse params with type: MessageType.SIGN_TYPED_DATA_V4', () => {
    const params = [from, typedDataString];
    const data = {
      params,
      method: MessageType.SIGN_TYPED_DATA_V4,
      id: '1',
    };
    const result = paramsToMessageParams(data);
    expect(result).toEqual({
      data: typedData,
      from,
    });
  });

  it('Should parse params with type: unknown', () => {
    const params = [from, paramData];
    const data = {
      params,
      method: 'fakeMethod' as MessageType,
      id: '1',
    };
    const result = paramsToMessageParams(data);
    expect(result).toEqual({
      data: paramData,
      from,
    });
  });
});
