import onPageActivated from './onPageActivated';

describe('src/background/providers/utils/onPageActivated', () => {
  it('calls callback immediately when document is not pre-rendering', () => {
    // eslint-disable-next-line
    // @ts-ignore Typescript does not know about Document#prerendering yet.
    document.prerendering = false;
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    const callback = jest.fn();
    onPageActivated(callback);

    expect(addEventListenerSpy).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls callback when "prerenderingchange" event is emitted', () => {
    // eslint-disable-next-line
    // @ts-ignore Typescript does not know about Document#prerendering yet.
    document.prerendering = true;
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    const callback = jest.fn();
    onPageActivated(callback);

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'prerenderingchange',
      expect.anything(),
      { once: true },
    );
    expect(callback).not.toHaveBeenCalled();

    (addEventListenerSpy.mock.calls[0]?.[1] as any)();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
