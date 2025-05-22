import onDomReady from './onDomReady';

describe('src/background/providers/utils/onDomReady', () => {
  it('calls callback immediately when document is already complete', () => {
    jest.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    const callback = jest.fn();
    onDomReady(callback);

    expect(addEventListenerSpy).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('calls callback immediately when document is already interactive', () => {
    jest.spyOn(document, 'readyState', 'get').mockReturnValue('interactive');
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    const callback = jest.fn();
    onDomReady(callback);

    expect(addEventListenerSpy).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls callback when DOM is loaded', () => {
    jest.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'addEventListener');

    const callback = jest.fn();
    onDomReady(callback);

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'DOMContentLoaded',
      expect.anything(),
      { once: true },
    );
    expect(callback).not.toHaveBeenCalled();

    (addEventListenerSpy.mock.calls[0]?.[1] as any)();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'DOMContentLoaded',
      addEventListenerSpy.mock.calls[0]?.[1],
      { once: true },
    );
  });
});
