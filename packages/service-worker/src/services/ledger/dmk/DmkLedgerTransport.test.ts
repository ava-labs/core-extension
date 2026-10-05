import { StatusCodes } from '@ledgerhq/hw-transport';
import type {
  DeviceManagementKit,
  DeviceSessionId,
} from '@ledgerhq/device-management-kit';
import { DmkLedgerTransport } from './DmkLedgerTransport';

describe('src/background/services/ledger/dmk/DmkLedgerTransport.ts', () => {
  const sessionId = 'session-id' as DeviceSessionId;
  let sendApdu: jest.Mock;
  let transport: DmkLedgerTransport;

  beforeEach(() => {
    sendApdu = jest.fn();
    transport = new DmkLedgerTransport(
      { sendApdu } as unknown as DeviceManagementKit,
      sessionId,
    );
  });

  it('forwards the raw APDU to the DMK session', async () => {
    sendApdu.mockResolvedValue({
      data: new Uint8Array(),
      statusCode: new Uint8Array([0x90, 0x00]),
    });

    await transport.exchange(Buffer.from([0xe0, 0x06, 0x00, 0x00, 0x00]));

    expect(sendApdu).toHaveBeenCalledWith({
      sessionId,
      apdu: new Uint8Array([0xe0, 0x06, 0x00, 0x00, 0x00]),
    });
  });

  it('appends the status word to the response payload', async () => {
    sendApdu.mockResolvedValue({
      data: new Uint8Array([0x01, 0x02, 0x03]),
      statusCode: new Uint8Array([0x90, 0x00]),
    });

    const response = await transport.exchange(Buffer.from([0xe0]));

    expect(response).toEqual(Buffer.from([0x01, 0x02, 0x03, 0x90, 0x00]));
  });

  it('builds `send` on top of `exchange` and checks the status word', async () => {
    sendApdu.mockResolvedValue({
      data: new Uint8Array([0xaa]),
      statusCode: new Uint8Array([0x69, 0x85]),
    });

    await expect(
      transport.send(0xe0, 0x06, 0x00, 0x00, Buffer.alloc(0), [StatusCodes.OK]),
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'TransportStatusError',
        statusCode: 0x6985,
      }),
    );
  });

  it('retries when the DMK is already sending an APDU', async () => {
    sendApdu
      .mockRejectedValueOnce({ _tag: 'AlreadySendingApduError' })
      .mockResolvedValue({
        data: new Uint8Array([0x01]),
        statusCode: new Uint8Array([0x90, 0x00]),
      });

    await expect(transport.exchange(Buffer.from([0xe0]))).resolves.toEqual(
      Buffer.from([0x01, 0x90, 0x00]),
    );
    expect(sendApdu).toHaveBeenCalledTimes(2);
  });

  it('propagates DMK rejections', async () => {
    const error = new Error('device disconnected');
    sendApdu.mockRejectedValue(error);

    await expect(transport.exchange(Buffer.from([0xe0]))).rejects.toBe(error);
  });
});
