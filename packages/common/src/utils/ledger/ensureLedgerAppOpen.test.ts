import Transport, {
  StatusCodes,
  TransportStatusError,
} from '@ledgerhq/hw-transport';
import {
  ensureLedgerAppOpen,
  getLedgerActiveApplication,
  getLedgerAutoOpenAppFailedMessage,
  getLedgerQuitAppFailedMessage,
  isLedgerDashboardApplication,
  parseLedgerGetAppAndVersionResponse,
} from './ensureLedgerAppOpen';

function encodeGetAppAndVersion(name: string, version: string): Buffer {
  const nameBytes = Buffer.from(name, 'ascii');
  const versionBytes = Buffer.from(version, 'ascii');
  return Buffer.concat([
    Buffer.from([0x01]),
    Buffer.from([nameBytes.length]),
    nameBytes,
    Buffer.from([versionBytes.length]),
    versionBytes,
  ]);
}

describe('getLedgerActiveApplication', () => {
  it('returns the active app name and version', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Bitcoin', '2.0.0'));

    await expect(getLedgerActiveApplication({ send })).resolves.toEqual({
      name: 'Bitcoin',
      version: '2.0.0',
    });

    expect(send).toHaveBeenCalledWith(0xb0, 0x01, 0x00, 0x00);
  });

  it('strips trailing 0x9000 before parsing (real transport shape)', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(
      Buffer.concat([
        encodeGetAppAndVersion('Bitcoin', '2.0.0'),
        Buffer.from([0x90, 0x00]),
      ]),
    );

    await expect(getLedgerActiveApplication({ send })).resolves.toEqual({
      name: 'Bitcoin',
      version: '2.0.0',
    });
  });
});

describe('parseLedgerGetAppAndVersionResponse', () => {
  it('parses a valid getAppAndVersion payload', () => {
    const buf = encodeGetAppAndVersion('Avalanche', '1.0.0');
    expect(parseLedgerGetAppAndVersionResponse(buf)).toEqual({
      name: 'Avalanche',
      version: '1.0.0',
    });
  });
});

describe('isLedgerDashboardApplication', () => {
  it('returns true for BOLOS', () => {
    expect(isLedgerDashboardApplication('BOLOS')).toBe(true);
  });

  it('returns false for a coin app', () => {
    expect(isLedgerDashboardApplication('Ethereum')).toBe(false);
  });
});

describe('ensureLedgerAppOpen (Avalanche)', () => {
  it('only queries the current app when Avalanche is already open', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Avalanche', '1.0.0'));

    await ensureLedgerAppOpen({ send }, 'Avalanche');

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(0xb0, 0x01, 0x00, 0x00);
  });

  it('sends openApp when the dashboard (BOLOS) is active', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Avalanche', '1.0.0'));

    await ensureLedgerAppOpen({ send }, 'Avalanche');

    expect(send).toHaveBeenCalledTimes(3);
    expect(send).toHaveBeenNthCalledWith(1, 0xb0, 0x01, 0x00, 0x00);
    expect(send).toHaveBeenNthCalledWith(
      2,
      0xe0,
      0xd8,
      0x00,
      0x00,
      Buffer.from('Avalanche', 'ascii'),
    );
    expect(send).toHaveBeenNthCalledWith(3, 0xb0, 0x01, 0x00, 0x00);
  });

  it('quits a non-dashboard app before opening Avalanche', async () => {
    jest.useFakeTimers();
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Ethereum', '1.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Avalanche', '1.0.0'));

    const done = ensureLedgerAppOpen({ send }, 'Avalanche');
    const assertion = expect(done).resolves.toBeUndefined();
    await jest.runAllTimersAsync();
    await assertion;

    expect(send).toHaveBeenCalledTimes(5);
    expect(send).toHaveBeenNthCalledWith(2, 0xb0, 0xa7, 0x00, 0x00);
    expect(send).toHaveBeenNthCalledWith(
      4,
      0xe0,
      0xd8,
      0x00,
      0x00,
      Buffer.from('Avalanche', 'ascii'),
    );
    jest.useRealTimers();
  });

  it('maps quit app failure to a clear message', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Ethereum', '1.0.0'));
    send.mockRejectedValueOnce(new TransportStatusError(0x6985));

    await expect(ensureLedgerAppOpen({ send }, 'Avalanche')).rejects.toThrow(
      getLedgerQuitAppFailedMessage(),
    );

    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenNthCalledWith(2, 0xb0, 0xa7, 0x00, 0x00);
  });

  it('maps APP_NOT_FOUND_OR_INVALID_CONTEXT to a clear install hint', async () => {
    jest.useFakeTimers();
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Ethereum', '1.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockRejectedValueOnce(
      new TransportStatusError(StatusCodes.APP_NOT_FOUND_OR_INVALID_CONTEXT),
    );

    const p = ensureLedgerAppOpen({ send }, 'Avalanche');
    const assertion = expect(p).rejects.toThrow(
      'The Avalanche app is not installed on this Ledger device',
    );
    await jest.runAllTimersAsync();
    await assertion;

    expect(send).toHaveBeenCalledTimes(4);
    jest.useRealTimers();
  });

  it('maps 0x6807 to an auto-open hint (not "not installed")', async () => {
    jest.useFakeTimers();
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockRejectedValueOnce(new TransportStatusError(0x6807));
    send.mockRejectedValueOnce(new TransportStatusError(0x6807));

    const p = ensureLedgerAppOpen({ send }, 'Avalanche');
    const assertion = expect(p).rejects.toThrow(
      getLedgerAutoOpenAppFailedMessage('Avalanche'),
    );
    await jest.runAllTimersAsync();
    await assertion;

    expect(send).toHaveBeenCalledTimes(3);
    jest.useRealTimers();
  });

  it('retries openApp once when the first attempt returns 0x6807', async () => {
    jest.useFakeTimers();
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockRejectedValueOnce(new TransportStatusError(0x6807));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Avalanche', '1.0.0'));

    const done = ensureLedgerAppOpen({ send }, 'Avalanche');
    const assertion = expect(done).resolves.toBeUndefined();
    await jest.runAllTimersAsync();
    await assertion;

    expect(send).toHaveBeenCalledTimes(4);
    jest.useRealTimers();
  });
});

describe('ensureLedgerAppOpen (Ethereum)', () => {
  it('only queries the current app when Ethereum is already open', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Ethereum', '1.0.0'));

    await ensureLedgerAppOpen({ send }, 'Ethereum');

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(0xb0, 0x01, 0x00, 0x00);
  });

  it('sends openApp when the dashboard (BOLOS) is active', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Ethereum', '1.0.0'));

    await ensureLedgerAppOpen({ send }, 'Ethereum');

    expect(send).toHaveBeenCalledTimes(3);
    expect(send).toHaveBeenNthCalledWith(
      2,
      0xe0,
      0xd8,
      0x00,
      0x00,
      Buffer.from('Ethereum', 'ascii'),
    );
  });

  it('quits a non-dashboard app before opening Ethereum', async () => {
    jest.useFakeTimers();
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Avalanche', '1.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Ethereum', '1.0.0'));

    const done = ensureLedgerAppOpen({ send }, 'Ethereum');
    const assertion = expect(done).resolves.toBeUndefined();
    await jest.runAllTimersAsync();
    await assertion;

    expect(send).toHaveBeenCalledTimes(5);
    expect(send).toHaveBeenNthCalledWith(2, 0xb0, 0xa7, 0x00, 0x00);
    jest.useRealTimers();
  });

  it('maps APP_NOT_FOUND_OR_INVALID_CONTEXT to a clear install hint', async () => {
    jest.useFakeTimers();
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Avalanche', '1.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockRejectedValueOnce(
      new TransportStatusError(StatusCodes.APP_NOT_FOUND_OR_INVALID_CONTEXT),
    );

    const p = ensureLedgerAppOpen({ send }, 'Ethereum');
    const assertion = expect(p).rejects.toThrow(
      'The Ethereum app is not installed on this Ledger device',
    );
    await jest.runAllTimersAsync();
    await assertion;

    expect(send).toHaveBeenCalledTimes(4);
    jest.useRealTimers();
  });

  it('maps 0x6807 to an auto-open hint (not "not installed")', async () => {
    jest.useFakeTimers();
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockRejectedValueOnce(new TransportStatusError(0x6807));
    send.mockRejectedValueOnce(new TransportStatusError(0x6807));

    const p = ensureLedgerAppOpen({ send }, 'Ethereum');
    const assertion = expect(p).rejects.toThrow(
      getLedgerAutoOpenAppFailedMessage('Ethereum'),
    );
    await jest.runAllTimersAsync();
    await assertion;

    expect(send).toHaveBeenCalledTimes(3);
    jest.useRealTimers();
  });
});

describe('ensureLedgerAppOpen (Bitcoin)', () => {
  it('only queries the current app when Bitcoin is already open', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Bitcoin', '2.0.0'));

    await ensureLedgerAppOpen({ send }, 'Bitcoin');

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(0xb0, 0x01, 0x00, 0x00);
  });

  it('sends openApp when the dashboard (BOLOS) is active', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Bitcoin', '2.0.0'));

    await ensureLedgerAppOpen({ send }, 'Bitcoin');

    expect(send).toHaveBeenCalledTimes(3);
    expect(send).toHaveBeenNthCalledWith(
      2,
      0xe0,
      0xd8,
      0x00,
      0x00,
      Buffer.from('Bitcoin', 'ascii'),
    );
  });

  it('quits a non-dashboard app before opening Bitcoin', async () => {
    jest.useFakeTimers();
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Ethereum', '1.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Bitcoin', '2.0.0'));

    const done = ensureLedgerAppOpen({ send }, 'Bitcoin');
    const assertion = expect(done).resolves.toBeUndefined();
    await jest.runAllTimersAsync();
    await assertion;

    expect(send).toHaveBeenCalledTimes(5);
    expect(send).toHaveBeenNthCalledWith(2, 0xb0, 0xa7, 0x00, 0x00);
    jest.useRealTimers();
  });
});

describe('ensureLedgerAppOpen (Solana)', () => {
  it('only queries the current app when Solana is already open', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Solana', '1.0.0'));

    await ensureLedgerAppOpen({ send }, 'Solana');

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(0xb0, 0x01, 0x00, 0x00);
  });

  it('sends openApp when the dashboard (BOLOS) is active', async () => {
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Solana', '1.0.0'));

    await ensureLedgerAppOpen({ send }, 'Solana');

    expect(send).toHaveBeenCalledTimes(3);
    expect(send).toHaveBeenNthCalledWith(
      2,
      0xe0,
      0xd8,
      0x00,
      0x00,
      Buffer.from('Solana', 'ascii'),
    );
  });

  it('quits a non-dashboard app before opening Solana', async () => {
    jest.useFakeTimers();
    const send = jest.fn() as jest.MockedFunction<Transport['send']>;
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Avalanche', '1.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('BOLOS', '2.0.0'));
    send.mockResolvedValueOnce(Buffer.from([0x90, 0x00]));
    send.mockResolvedValueOnce(encodeGetAppAndVersion('Solana', '1.0.0'));

    const done = ensureLedgerAppOpen({ send }, 'Solana');
    const assertion = expect(done).resolves.toBeUndefined();
    await jest.runAllTimersAsync();
    await assertion;

    expect(send).toHaveBeenCalledTimes(5);
    expect(send).toHaveBeenNthCalledWith(2, 0xb0, 0xa7, 0x00, 0x00);
    jest.useRealTimers();
  });
});
