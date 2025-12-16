import EventEmitter from 'events';
import LRU from 'lru-cache';
import { Subject } from 'rxjs';
import { LedgerEvent, LedgerDeviceResponseData } from '@core/types';
import { LedgerService } from './LedgerService';
import { LedgerTransport } from './LedgerTransport';

jest.mock('events');
jest.mock('rxjs');
jest.mock('lru-cache');
jest.mock('./LedgerTransport');

describe('src/background/services/ledger/LedgerService.ts', () => {
  let ledgerService: LedgerService;
  let eventEmitterMock;

  const ledgerRequestSubscriptionMock = {
    unsubscribe: jest.fn(),
  };

  const ledgerDeviceRequestMock = {
    subscribe: jest.fn(),
  };

  const ledgerDeviceResponseMock = {
    subscribe: jest.fn(),
    next: jest.fn(),
  };

  const lruCacheMock = (LRU as unknown as jest.Mock).mock.instances[0];

  beforeEach(() => {
    jest.resetAllMocks();

    ledgerDeviceRequestMock.subscribe.mockReturnValue(
      ledgerRequestSubscriptionMock,
    );

    (Subject as unknown as jest.Mock)
      .mockReturnValueOnce(ledgerDeviceRequestMock)
      .mockReturnValueOnce(ledgerDeviceResponseMock);

    ledgerService = new LedgerService();
    ledgerService.onUnlock();

    eventEmitterMock = (EventEmitter as unknown as jest.Mock).mock.instances[0];
  });

  it('handles events correctly on unlock', () => {
    expect(ledgerDeviceRequestMock.subscribe).toBeCalledWith(
      expect.any(Function), // we test the actual callback below
    );
    expect(eventEmitterMock.emit).toBeCalledWith(
      LedgerEvent.DISCOVER_TRANSPORTS,
    );
    expect(eventEmitterMock.emit).not.toBeCalledWith(
      LedgerEvent.TRANSPORT_REQUEST,
      undefined,
    );

    // execute ledger request callback manually
    ledgerDeviceRequestMock.subscribe.mock.calls[0][0]();
    expect(eventEmitterMock.emit).toBeCalledWith(
      LedgerEvent.TRANSPORT_REQUEST,
      undefined,
    );
  });

  it('cleans up properly on lock', () => {
    ledgerService.onLock();
    expect(lruCacheMock.clear).toBeCalled();
    expect(ledgerRequestSubscriptionMock.unsubscribe).toBeCalled();
  });

  it('adds event listeners correctly', () => {
    const eventMock = LedgerEvent.TRANSPORT_REQUEST;
    const callbackMock = jest.fn();

    ledgerService.addListener(eventMock, callbackMock);
    expect(eventEmitterMock.on).toBeCalledWith(eventMock, callbackMock);
  });

  it('returns the correct transport from cache', () => {
    const transportId = '1';
    const transportMock = { foo: 'bar' };
    lruCacheMock.get.mockReturnValueOnce(transportMock);

    expect(ledgerService.getTransport(transportId)).toStrictEqual(
      transportMock,
    );
    expect(lruCacheMock.get).toBeCalledWith(transportId);
  });

  it('returns the most recent transport correctly', () => {
    const recentId = '1';
    const transportMock = { foo: 'bar' };
    const generatorMock = { next: jest.fn(() => ({ value: recentId })) };
    lruCacheMock.keys.mockReturnValueOnce(generatorMock);
    lruCacheMock.peek.mockReturnValueOnce(transportMock);

    expect(ledgerService.recentTransport).toStrictEqual(transportMock);
    expect(lruCacheMock.keys).toBeCalled();
    expect(generatorMock.next).toBeCalled();
    expect(lruCacheMock.peek).toBeCalledWith(recentId);
  });

  it('removes a transport from the cache properly', () => {
    const transportId = '1';

    ledgerService.removeTransportFromCache(transportId);
    expect(lruCacheMock.delete).toBeCalledWith(transportId);
  });

  it('closes a transport correctly', async () => {
    jest.useFakeTimers();
    const promise = ledgerService.closeOpenedTransport('id');
    jest.advanceTimersByTime(100);

    await expect(promise).resolves.toBe(true);
    expect(eventEmitterMock.emit).toHaveBeenCalledWith(
      LedgerEvent.TRANSPORT_CLOSE_REQUEST,
      'id',
    );
    jest.useRealTimers();
  });

  it('does not init the same transport twice', () => {
    const transportId = '1';
    const transportMock = { foo: 'bar' };
    lruCacheMock.get.mockReturnValueOnce(transportMock);

    ledgerService.initTransport(transportId);
    expect(lruCacheMock.set).not.toBeCalled();
  });

  it('inits a new transport correctly', () => {
    const transportId = '1';

    ledgerService.initTransport(transportId);
    expect(lruCacheMock.set).toBeCalledWith(
      transportId,
      expect.any(LedgerTransport),
    );
    expect(LedgerTransport).toBeCalledWith(
      ledgerDeviceRequestMock,
      ledgerDeviceResponseMock,
      transportId,
    );
  });

  it('returns the next ledger response correctly', () => {
    const responseMock = { foo: 'bar' } as unknown as LedgerDeviceResponseData;

    ledgerService.ledgerResponse(responseMock);
    expect(ledgerDeviceResponseMock.next).toBeCalledWith(responseMock);
  });
});
