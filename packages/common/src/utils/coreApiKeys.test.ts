type CoreApiKeysModule = typeof import('./coreApiKeys');

type ChangeListener = (
  changes: Record<string, chrome.storage.StorageChange>,
  areaName: string,
) => void;

describe('utils/coreApiKeys', () => {
  const realStorage = chrome.storage;
  let get: jest.Mock;
  let listeners: ChangeListener[];

  const loadModule = (): CoreApiKeysModule => {
    let module: CoreApiKeysModule | undefined;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      module = require('./coreApiKeys');
    });
    return module as CoreApiKeysModule;
  };

  const emitChange = (newValue: unknown, areaName = 'local') =>
    listeners.forEach((listener) =>
      listener({ 'core.api-keys': { newValue } }, areaName),
    );

  beforeEach(() => {
    listeners = [];
    get = jest.fn().mockResolvedValue({});
    chrome.storage = {
      local: { get },
      onChanged: {
        addListener: (listener: ChangeListener) => listeners.push(listener),
      },
    } as unknown as typeof chrome.storage;
  });

  afterEach(() => {
    chrome.storage = realStorage;
  });

  it('reads keys from chrome.storage.local', async () => {
    get.mockResolvedValue({
      'core.api-keys': { proxy: 'proxy-key', glacier: 'glacier-key' },
    });
    const { getCoreApiKey } = loadModule();

    await expect(getCoreApiKey('proxy')).resolves.toBe('proxy-key');
    await expect(getCoreApiKey('glacier')).resolves.toBe('glacier-key');
    await expect(getCoreApiKey('markr')).resolves.toBeUndefined();
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('core.api-keys');
  });

  it('ignores blank, non-string and unknown entries', async () => {
    get.mockResolvedValue({
      'core.api-keys': {
        proxy: '  ',
        glacier: 123,
        markr: ' markr-token ',
        unknown: 'x',
      },
    });
    const { loadCoreApiKeys } = loadModule();

    await expect(loadCoreApiKeys()).resolves.toEqual({ markr: 'markr-token' });
  });

  it('returns nothing from the cache until the first read resolves', async () => {
    get.mockResolvedValue({ 'core.api-keys': { markr: 'markr-token' } });
    const { getCachedCoreApiKey, loadCoreApiKeys } = loadModule();

    expect(getCachedCoreApiKey('markr')).toBeUndefined();
    await loadCoreApiKeys();
    expect(getCachedCoreApiKey('markr')).toBe('markr-token');
  });

  it('picks up keys written after startup', async () => {
    const { getCoreApiKey, getCachedCoreApiKey } = loadModule();

    await expect(getCoreApiKey('proxy')).resolves.toBeUndefined();

    emitChange({ proxy: 'late-proxy-key' });
    expect(getCachedCoreApiKey('proxy')).toBe('late-proxy-key');

    emitChange(undefined);
    expect(getCachedCoreApiKey('proxy')).toBeUndefined();
  });

  it('ignores changes from other storage areas', async () => {
    const { getCoreApiKey, getCachedCoreApiKey } = loadModule();
    await getCoreApiKey('proxy');

    emitChange({ proxy: 'session-key' }, 'session');

    expect(getCachedCoreApiKey('proxy')).toBeUndefined();
  });

  it('keeps a write that lands while the initial read is in flight', async () => {
    let resolveGet: (value: unknown) => void = () => {};
    get.mockReturnValue(new Promise((resolve) => (resolveGet = resolve)));
    const { getCoreApiKey } = loadModule();

    const pending = getCoreApiKey('proxy');
    emitChange({ proxy: 'new-key' });
    resolveGet({ 'core.api-keys': { proxy: 'stale-key' } });

    await expect(pending).resolves.toBe('new-key');
  });

  it('returns no keys when chrome.storage is unavailable', async () => {
    chrome.storage = undefined as unknown as typeof chrome.storage;
    const { getCoreApiKey } = loadModule();

    await expect(getCoreApiKey('proxy')).resolves.toBeUndefined();
  });

  it('returns no keys when the storage read fails', async () => {
    get.mockRejectedValue(new Error('storage exploded'));
    const { getCoreApiKey } = loadModule();

    await expect(getCoreApiKey('proxy')).resolves.toBeUndefined();
  });
});
