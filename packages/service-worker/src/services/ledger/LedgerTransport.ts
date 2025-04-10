import Transport, {
  StatusCodes,
  TransportError,
  TransportStatusError,
} from '@ledgerhq/hw-transport';
import { filter, firstValueFrom, map, Subject } from 'rxjs';
import { DeviceResponseData } from './models';

export class LedgerTransport extends Transport {
  constructor(
    private deviceRequest: Subject<any>,
    private deviceResponse: Subject<DeviceResponseData>,
    private connectionUUID: string,
  ) {
    super();
  }

  send = async (
    cla: number,
    ins: number,
    p1: number,
    p2: number,
    data: Buffer = Buffer.alloc(0),
    statusList: Array<number> = [StatusCodes.OK],
  ): Promise<Buffer> => {
    if (data.length >= 256) {
      throw new TransportError(
        'data.length exceed 256 bytes limit. Got: ' + data.length,
        'DataLengthTooBig',
      );
    }

    const requestId = crypto.randomUUID();
    this.deviceRequest.next({
      method: 'SEND',
      requestId,
      connectionUUID: this.connectionUUID,
      params: {
        cla,
        ins,
        p1,
        p2,
        data,
        statusList,
      },
    });

    return firstValueFrom(
      this.deviceResponse.pipe(
        filter((response) => response.requestId === requestId),
        map((response) => {
          if (response.error) {
            throw new TransportStatusError(response.error);
          }
          return Buffer.from(response.result ?? []);
        }),
      ),
    );
  };
}
