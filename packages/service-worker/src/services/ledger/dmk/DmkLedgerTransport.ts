import Transport from '@ledgerhq/hw-transport';
import type {
  DeviceManagementKit,
  DeviceSessionId,
} from '@ledgerhq/device-management-kit';

/**
 * Adapts a Device Management Kit session to the `@ledgerhq/hw-transport`
 * interface so the X/P (`hw-app-avalanche`), Bitcoin (`ledger-bitcoin`) and
 * Solana (`hw-app-solana`) apps can talk to the device through the DMK.
 *
 * Implementing `exchange` is enough: the base `Transport` builds `send` (and
 * therefore the status-word check) on top of it.
 */
const APDU_BUSY_RETRIES = 8;
const APDU_BUSY_RETRY_MS = 150;

const isAlreadySendingApdu = (error: unknown): boolean => {
  if (error && typeof error === 'object' && '_tag' in error) {
    return error._tag === 'AlreadySendingApduError';
  }
  return String(error).includes('AlreadySendingApduError');
};

export class DmkLedgerTransport extends Transport {
  constructor(
    private dmk: DeviceManagementKit,
    private sessionId: DeviceSessionId,
  ) {
    super();
  }

  exchange = async (apdu: Buffer): Promise<Buffer> => {
    let response: Awaited<ReturnType<DeviceManagementKit['sendApdu']>>;
    for (let attempt = 0; ; attempt++) {
      try {
        response = await this.dmk.sendApdu({
          sessionId: this.sessionId,
          apdu: Uint8Array.from(apdu),
        });
        break;
      } catch (error) {
        if (!isAlreadySendingApdu(error) || attempt >= APDU_BUSY_RETRIES) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, APDU_BUSY_RETRY_MS));
      }
    }

    // hw-transport consumers expect the 2-byte status word appended to the payload.
    const payload = new Uint8Array(
      response.data.length + response.statusCode.length,
    );
    payload.set(response.data, 0);
    payload.set(response.statusCode, response.data.length);

    return Buffer.from(payload);
  };
}
