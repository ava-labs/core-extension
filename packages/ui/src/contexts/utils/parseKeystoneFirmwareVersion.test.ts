import { parseKeystoneFirmwareVersion } from './parseKeystoneFirmwareVersion';

describe('contexts/utils/parseKeystoneFirmwareVersion', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('subtracts the USB major offset so the result matches the device UI', () => {
    expect(parseKeystoneFirmwareVersion('12.4.2')).toBe('2.4.2');
  });

  it('preserves minor and patch segments', () => {
    expect(parseKeystoneFirmwareVersion('15.0.0')).toBe('5.0.0');
    expect(parseKeystoneFirmwareVersion('11.99.100')).toBe('1.99.100');
  });

  it('allows major zero when the reported major equals the offset', () => {
    expect(parseKeystoneFirmwareVersion('10.1.0')).toBe('0.1.0');
  });

  it('returns the input unchanged when the string is not three dot-separated parts', () => {
    expect(parseKeystoneFirmwareVersion('')).toBe('');
    expect(parseKeystoneFirmwareVersion('12')).toBe('12');
    expect(parseKeystoneFirmwareVersion('12.4')).toBe('12.4');
    expect(parseKeystoneFirmwareVersion('12.4.')).toBe('12.4.');

    expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
  });

  it('logs a descriptive error when the version is rejected', () => {
    parseKeystoneFirmwareVersion('not-a-version');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[parseKeystoneFirmwareVersion] Non-SemVer firmware version reported:',
      'not-a-version',
    );
  });
});
