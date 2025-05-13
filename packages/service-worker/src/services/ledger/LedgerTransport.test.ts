import { Subject } from 'rxjs';
import { StatusCodes } from '@ledgerhq/hw-transport';
import { LedgerTransport } from './LedgerTransport';
import { LedgerDeviceRequestData, LedgerDeviceResponseData } from '@core/types';

describe('src/background/services/ledger/LedgerTransport.ts', () => {
  let ledgerDeviceRequest$: Subject<LedgerDeviceRequestData>;
  let ledgerDeviceResponse$: Subject<LedgerDeviceResponseData>;
  let ledgerTransport: LedgerTransport;
  const uuid = 'uuid';

  beforeEach(() => {
    jest.resetAllMocks();
    (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);

    ledgerDeviceRequest$ = new Subject<LedgerDeviceRequestData>();
    ledgerDeviceResponse$ = new Subject<LedgerDeviceResponseData>();

    ledgerTransport = new LedgerTransport(
      ledgerDeviceRequest$,
      ledgerDeviceResponse$,
      uuid,
    );
  });

  it('throws if data is too big', async () => {
    const dataLength = 257;
    const data = Buffer.alloc(dataLength);
    await expect(
      ledgerTransport.send(1, 2, 3, 4, data, [StatusCodes.OK]),
    ).rejects.toThrow(
      expect.objectContaining({
        id: 'DataLengthTooBig',
        name: 'TransportError',
        message: `data.length exceed 256 bytes limit. Got: ${dataLength}`,
      }),
    );
  });

  it('throws upon response errors there', async () => {
    const data = Buffer.alloc(0);
    const prom = ledgerTransport.send(1, 2, 3, 4, data, [StatusCodes.OK]);

    ledgerDeviceResponse$.next({
      requestId: uuid,
      error: '111',
    } as LedgerDeviceResponseData);

    await expect(prom).rejects.toThrow(
      expect.objectContaining({
        name: 'TransportStatusError',
        message: 'Ledger device: UNKNOWN_ERROR (0x111)',
      }),
    );
  });

  it('sends a request and returns the response correctly', async () => {
    const requestSpy = jest.spyOn(ledgerDeviceRequest$, 'next');
    const data = Buffer.alloc(0);
    const result = '0x1';
    const prom = ledgerTransport.send(1, 2, 3, 4, data, [StatusCodes.OK]);

    ledgerDeviceResponse$.next({
      requestId: uuid,
      result,
    } as LedgerDeviceResponseData);

    await expect(prom).resolves.toEqual(Buffer.from(result));
    expect(requestSpy).toHaveBeenCalledWith({
      method: 'SEND',
      requestId: uuid,
      connectionUUID: uuid,
      params: {
        cla: 1,
        ins: 2,
        p1: 3,
        p2: 4,
        data,
        statusList: [StatusCodes.OK],
      },
    });
  });
});
