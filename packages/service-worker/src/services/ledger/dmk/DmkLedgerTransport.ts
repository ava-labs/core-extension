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
export class DmkLedgerTransport extends Transport {
  constructor(
    private dmk: DeviceManagementKit,
    private sessionId: DeviceSessionId,
  ) {
    super();
  }

  exchange = async (apdu: Buffer): Promise<Buffer> => {
    const response = await this.dmk.sendApdu({
      sessionId: this.sessionId,
      apdu: Uint8Array.from(apdu),
    });

    // hw-transport consumers expect the 2-byte status word appended to the payload.
    const payload = new Uint8Array(
      response.data.length + response.statusCode.length,
    );
    payload.set(response.data, 0);
    payload.set(response.statusCode, response.data.length);

    return Buffer.from(payload);
  };
}
