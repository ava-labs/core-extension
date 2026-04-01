import Transport, {
  StatusCodes,
  TransportStatusError,
} from '@ledgerhq/hw-transport';

/** BOLOS name for the Zondax Avalanche app (must match `getAppAndVersion`). */
export const AVALANCHE_LEDGER_APP_NAME = 'Avalanche';

/** BOLOS name for the Ethereum app (must match `getAppAndVersion`). */
export const ETHEREUM_LEDGER_APP_NAME = 'Ethereum';

/** BOLOS name for the Solana app (must match `getAppAndVersion`). */
export const SOLANA_LEDGER_APP_NAME = 'Solana';

/** BOLOS name for the Bitcoin app (must match `getAppAndVersion` / `LedgerAppType.BITCOIN`). */
export const BITCOIN_LEDGER_APP_NAME = 'Bitcoin';

/** Ledger DMK `GetAppAndVersionCommand` — CLA/INS. */
const GET_APP_AND_VERSION_CLA = 0xb0;
const GET_APP_AND_VERSION_INS = 0x01;

/** Ledger DMK `OpenAppCommand` — CLA/INS. */
const OPEN_APP_CLA = 0xe0;
const OPEN_APP_INS = 0xd8;

/**
 * Return to BOLOS from a running app (same as Ledger Live `ledger-live-common/src/hw/quitApp.ts`).
 * `OpenAppCommand` is only handled on the dashboard; inside another app it must be sent after quit.
 */
const QUIT_APP_CLA = 0xb0;
const QUIT_APP_INS = 0xa7;

/** Names reported by `GetAppAndVersion` on the device home screen (Ledger Live `isDashboardName`). */
const LEDGER_DASHBOARD_APP_NAMES = new Set<string>(['BOLOS', 'OLOS\u0000']);

const POST_QUIT_SETTLE_MS = 400;
const MAX_ENSURE_APP_ROUNDS = 6;

/**
 * BOLOS often returns 0x6807 when OpenApp is rejected (e.g. dashboard + browser transport), not only
 * when the app is missing. Use {@link StatusCodes.APP_NOT_FOUND_OR_INVALID_CONTEXT} for a definitive
 * missing-app signal.
 */
export function getLedgerAutoOpenAppFailedMessage(appName: string): string {
  return `Could not switch to the ${appName} app automatically. Open it on your Ledger, then try again.`;
}

export function getLedgerQuitAppFailedMessage(): string {
  return 'Could not exit the current Ledger app automatically. Return to the device home screen, then try again.';
}

export function getLedgerAppNotInstalledMessage(appName: string): string {
  return `The ${appName} app is not installed on this Ledger device. Install it from Ledger Live, then try again.`;
}

export function isLedgerDashboardApplication(name: string): boolean {
  return LEDGER_DASHBOARD_APP_NAMES.has(name);
}

/** Strip SW when present (`transport.send` returns payload + `0x9000` on success). */
function apduBodyWithoutSuccessSw(data: Buffer): Buffer {
  if (
    data.length >= 2 &&
    data.readUInt16BE(data.length - 2) === StatusCodes.OK
  ) {
    return data.subarray(0, data.length - 2);
  }
  return data;
}

/**
 * Parses GetAppAndVersion payload (no status word). Matches `@ledgerhq/hw-app-eth`
 * `getAppAndVersion` field layout; first byte is skipped (format), not validated.
 */
export function parseLedgerGetAppAndVersionResponse(data: Buffer): {
  name: string;
  version: string;
} {
  if (data.length < 3) {
    throw new Error('getAppAndVersion: response too short');
  }
  let offset = 1;
  const nameLength = data.readUInt8(offset);
  offset += 1;
  if (offset + nameLength > data.length) {
    throw new Error('getAppAndVersion: invalid name length');
  }
  const name = data.subarray(offset, offset + nameLength).toString('ascii');
  offset += nameLength;
  if (offset >= data.length) {
    throw new Error('getAppAndVersion: response truncated after app name');
  }
  const versionLength = data.readUInt8(offset);
  offset += 1;
  if (offset + versionLength > data.length) {
    throw new Error('getAppAndVersion: invalid version length');
  }
  const version = data
    .subarray(offset, offset + versionLength)
    .toString('ascii');
  return { name, version };
}

/**
 * BOLOS `GetAppAndVersion` — current application name and version on the device.
 */
export async function getLedgerActiveApplication(
  transport: Pick<Transport, 'send'>,
): Promise<{ name: string; version: string }> {
  const data = await transport.send(
    GET_APP_AND_VERSION_CLA,
    GET_APP_AND_VERSION_INS,
    0x00,
    0x00,
  );
  return parseLedgerGetAppAndVersionResponse(apduBodyWithoutSuccessSw(data));
}

/**
 * Open-app APDU data: raw ASCII app name only (same as Ledger Live
 * `ledger-live-common/src/hw/openApp.ts`). Lc is set by `transport.send`;
 * do not prepend a separate length byte.
 */
function buildOpenLedgerAppPayload(appName: string): Buffer {
  const ascii = Buffer.from(appName, 'ascii');
  if (ascii.length === 0 || ascii.length > 255) {
    throw new Error('Invalid Ledger app name length');
  }
  return ascii;
}

const OPEN_APP_EXCHANGE_MS = 60_000;
const OPEN_APP_RETRY_DELAY_MS = 500;

function mapOpenAppTransportError(
  err: unknown,
  notInstalledMessage: string,
  autoOpenFailedMessage: string,
): Error {
  if (err instanceof TransportStatusError) {
    if (err.statusCode === StatusCodes.APP_NOT_FOUND_OR_INVALID_CONTEXT) {
      return new Error(notInstalledMessage);
    }
    if (
      err.statusCode === 0x6807 ||
      err.statusCode === StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED
    ) {
      return new Error(autoOpenFailedMessage);
    }
  }
  return err instanceof Error ? err : new Error(String(err));
}

async function openLedgerAppByName(
  transport: Pick<Transport, 'send'>,
  appName: string,
  notInstalledMessage: string,
  autoOpenFailedMessage: string,
): Promise<void> {
  const fullTransport = transport as Transport;
  const previousTimeout = fullTransport.exchangeTimeout;
  const sendOpen = () =>
    transport.send(
      OPEN_APP_CLA,
      OPEN_APP_INS,
      0x00,
      0x00,
      buildOpenLedgerAppPayload(appName),
    );

  fullTransport.setExchangeTimeout?.(OPEN_APP_EXCHANGE_MS);

  try {
    try {
      await sendOpen();
    } catch (first) {
      if (
        first instanceof TransportStatusError &&
        first.statusCode === 0x6807
      ) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, OPEN_APP_RETRY_DELAY_MS);
        });
        try {
          await sendOpen();
        } catch (second) {
          throw mapOpenAppTransportError(
            second,
            notInstalledMessage,
            autoOpenFailedMessage,
          );
        }
        return;
      }
      throw mapOpenAppTransportError(
        first,
        notInstalledMessage,
        autoOpenFailedMessage,
      );
    }
  } finally {
    fullTransport.setExchangeTimeout?.(previousTimeout);
  }
}

async function quitLedgerApplication(
  transport: Pick<Transport, 'send'>,
): Promise<void> {
  try {
    await transport.send(QUIT_APP_CLA, QUIT_APP_INS, 0x00, 0x00);
  } catch (err) {
    if (err instanceof TransportStatusError) {
      throw new Error(getLedgerQuitAppFailedMessage());
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
}

async function ensureLedgerAppOpen(
  transport: Pick<Transport, 'send'>,
  appName: string,
  notInstalledMessage: string,
): Promise<void> {
  const autoOpenFailedMessage = getLedgerAutoOpenAppFailedMessage(appName);

  for (let round = 0; round < MAX_ENSURE_APP_ROUNDS; round += 1) {
    const { name } = await getLedgerActiveApplication(transport);
    if (name === appName) {
      return;
    }
    if (isLedgerDashboardApplication(name)) {
      await openLedgerAppByName(
        transport,
        appName,
        notInstalledMessage,
        autoOpenFailedMessage,
      );
      continue;
    }
    await quitLedgerApplication(transport);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, POST_QUIT_SETTLE_MS);
    });
  }

  throw new Error(autoOpenFailedMessage);
}

/**
 * If the device is not already running the Avalanche Ledger app: from the home
 * screen sends `OpenAppCommand` (0xe0 / 0xd8); from another app sends `QuitApp`
 * (0xb0 / 0xa7) first, then opens Avalanche once BOLOS is active. If the app is
 * not installed, throws with an install hint (status 0x5123).
 */
export async function ensureAvalancheLedgerAppOpen(
  transport: Pick<Transport, 'send'>,
): Promise<void> {
  await ensureLedgerAppOpen(
    transport,
    AVALANCHE_LEDGER_APP_NAME,
    getLedgerAppNotInstalledMessage(AVALANCHE_LEDGER_APP_NAME),
  );
}

/**
 * Same switching behavior as {@link ensureAvalancheLedgerAppOpen} for the
 * Ethereum app. Use with `@ledgerhq/hw-app-eth` (`LedgerSigner`,
 * `getLedgerExtendedPublicKey`, `getPubKeyFromTransport` in core-wallets-sdk).
 */
export async function ensureEthereumLedgerAppOpen(
  transport: Pick<Transport, 'send'>,
): Promise<void> {
  await ensureLedgerAppOpen(
    transport,
    ETHEREUM_LEDGER_APP_NAME,
    getLedgerAppNotInstalledMessage(ETHEREUM_LEDGER_APP_NAME),
  );
}

/**
 * Same switching behavior as {@link ensureAvalancheLedgerAppOpen} for the
 * Solana Ledger app (`@ledgerhq/hw-app-solana`).
 */
export async function ensureSolanaLedgerAppOpen(
  transport: Pick<Transport, 'send'>,
): Promise<void> {
  await ensureLedgerAppOpen(
    transport,
    SOLANA_LEDGER_APP_NAME,
    getLedgerAppNotInstalledMessage(SOLANA_LEDGER_APP_NAME),
  );
}

/**
 * Same switching behavior as {@link ensureAvalancheLedgerAppOpen} for the
 * Bitcoin Ledger app (`ledger-bitcoin` `AppClient`).
 */
export async function ensureBitcoinLedgerAppOpen(
  transport: Pick<Transport, 'send'>,
): Promise<void> {
  await ensureLedgerAppOpen(
    transport,
    BITCOIN_LEDGER_APP_NAME,
    getLedgerAppNotInstalledMessage(BITCOIN_LEDGER_APP_NAME),
  );
}
