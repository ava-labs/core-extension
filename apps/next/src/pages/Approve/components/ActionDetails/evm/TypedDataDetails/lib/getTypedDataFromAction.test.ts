import { RpcMethod } from '@avalabs/vm-module-types';
import { Action } from '@core/types';

import { getTypedDataFromAction } from './getTypedDataFromAction';

const buildAction = (signingData: unknown): Action =>
  ({ displayData: {}, signingData }) as unknown as Action;

describe('getTypedDataFromAction', () => {
  const typedData = {
    types: { EIP712Domain: [] },
    primaryType: 'Permit',
    domain: {},
    message: {},
  };

  it.each([
    RpcMethod.SIGN_TYPED_DATA,
    RpcMethod.SIGN_TYPED_DATA_V1,
    RpcMethod.SIGN_TYPED_DATA_V3,
    RpcMethod.SIGN_TYPED_DATA_V4,
  ])('returns the typed data for %s', (type) => {
    expect(
      getTypedDataFromAction(
        buildAction({ type, account: '0x', data: typedData }),
      ),
    ).toBe(typedData);
  });

  it('returns the array form for V1 typed data', () => {
    const arrayForm = [{ name: 'a', type: 'string', value: 'b' }];
    expect(
      getTypedDataFromAction(
        buildAction({
          type: RpcMethod.SIGN_TYPED_DATA_V1,
          account: '0x',
          data: arrayForm,
        }),
      ),
    ).toBe(arrayForm);
  });

  it('returns null for non-typed-data signing methods', () => {
    expect(
      getTypedDataFromAction(
        buildAction({
          type: RpcMethod.PERSONAL_SIGN,
          account: '0x',
          data: 'hello',
        }),
      ),
    ).toBeNull();
  });

  it('returns null when there is no signing data', () => {
    expect(getTypedDataFromAction(buildAction(undefined))).toBeNull();
  });

  it('returns null when typed data is not an object', () => {
    expect(
      getTypedDataFromAction(
        buildAction({
          type: RpcMethod.SIGN_TYPED_DATA_V4,
          account: '0x',
          data: 'not-an-object',
        }),
      ),
    ).toBeNull();
  });
});
