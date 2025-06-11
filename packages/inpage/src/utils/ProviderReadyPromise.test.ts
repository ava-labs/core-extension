import {
  InitializationStep,
  ProviderReadyPromise,
} from './ProviderReadyPromise';

describe('src/background/providers/utils/ProviderReadyPromise', () => {
  it('calls immediately if all checks are checked', async () => {
    const initializedPromise = new ProviderReadyPromise([
      InitializationStep.DOMAIN_METADATA_SENT,
    ]);
    initializedPromise.check(InitializationStep.DOMAIN_METADATA_SENT);
    initializedPromise.check(InitializationStep.PROVIDER_STATE_LOADED);

    const callMock = jest.fn();
    initializedPromise.call(callMock);

    await new Promise(process.nextTick);
    expect(callMock).toHaveBeenCalled();
  });

  it('calls pending requests when last check is checked', async () => {
    const initializedPromise = new ProviderReadyPromise([
      InitializationStep.DOMAIN_METADATA_SENT,
      InitializationStep.PROVIDER_STATE_LOADED,
    ]);
    initializedPromise.check(InitializationStep.DOMAIN_METADATA_SENT);

    const callMock = jest.fn();
    initializedPromise.call(callMock);
    expect(callMock).not.toHaveBeenCalled();

    initializedPromise.check(InitializationStep.PROVIDER_STATE_LOADED);

    await new Promise(process.nextTick);
    expect(callMock).toHaveBeenCalled();
  });

  it('suspends calls when a check is unckecked', async () => {
    const initializedPromise = new ProviderReadyPromise([
      InitializationStep.DOMAIN_METADATA_SENT,
      InitializationStep.PROVIDER_STATE_LOADED,
    ]);
    initializedPromise.check(InitializationStep.DOMAIN_METADATA_SENT);
    initializedPromise.check(InitializationStep.PROVIDER_STATE_LOADED);

    const callMock = jest.fn();
    initializedPromise.call(callMock);

    expect(callMock).toHaveBeenCalledTimes(1);

    initializedPromise.uncheck(InitializationStep.DOMAIN_METADATA_SENT);
    initializedPromise.call(callMock);

    expect(callMock).toHaveBeenCalledTimes(1);
    initializedPromise.check(InitializationStep.DOMAIN_METADATA_SENT);

    await new Promise(process.nextTick);
    expect(callMock).toHaveBeenCalledTimes(2);
  });
});
