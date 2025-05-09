import { Web3Event } from '@core/types';

import { AccountsChangedCAEvents } from './accountsChangedCAEvent';
import { NetworkVMType } from '@avalabs/vm-module-types';

jest.mock('../AccountsService');
jest.mock('../../permissions/PermissionsService');

describe('AccountsChangedCAEvents', () => {
  const accountsService = {
    activeAccount: {
      addressC: '0x123',
    },
    addListener: jest.fn(),
  } as any;
  const permissionsService = {
    getPermissionsForDomain: jest.fn(),
    addListener: jest.fn(),
  } as any;

  const getEventEmitter = (domain = 'example.com') => {
    const emitter = new AccountsChangedCAEvents(
      accountsService,
      permissionsService,
    );
    emitter.setConnectionInfo({ domain });

    return emitter;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listens for permissions state updates', async () => {
    const permissions = {
      'example.com': {
        domain: 'example.com',
        accounts: { '0x123': 'vm1' },
      },
    };
    (permissionsService.addListener as jest.Mock).mockImplementation(
      (_, callback) => {
        callback(permissions);
      },
    );

    const emitterExampleCom = getEventEmitter('example.com');
    const emitterOtherCom = getEventEmitter('other.com');

    const listenerExampleCom = permissionsService.addListener.mock.calls[0][1];

    jest.spyOn(emitterExampleCom, 'emitAccountsChanged');
    jest.spyOn(emitterOtherCom, 'emitAccountsChanged');

    // Mock an event coming in
    listenerExampleCom(permissions);

    expect(emitterExampleCom.emitAccountsChanged).toHaveBeenCalledWith(
      permissions['example.com'],
    );
    expect(emitterOtherCom.emitAccountsChanged).not.toHaveBeenCalled();
  });

  it('listens for accounts state updates', async () => {
    const permissions = {
      'example.com': {
        domain: 'example.com',
        accounts: { '0x123': 'vm1' },
      },
    };
    (permissionsService.getPermissionsForDomain as jest.Mock).mockResolvedValue(
      permissions['example.com'],
    );
    (accountsService.addListener as jest.Mock).mockImplementation(
      (_, callback) => {
        callback(permissions);
      },
    );

    const emitterExampleCom = getEventEmitter('example.com');
    const emitterOtherCom = getEventEmitter('other.com');

    const listenerExampleCom = accountsService.addListener.mock.calls[0][1];

    jest.spyOn(emitterExampleCom, 'emitAccountsChanged');
    jest.spyOn(emitterOtherCom, 'emitAccountsChanged');

    // Mock an event coming in
    await listenerExampleCom();

    expect(emitterExampleCom.emitAccountsChanged).toHaveBeenCalledWith(
      permissions['example.com'],
    );
    expect(emitterOtherCom.emitAccountsChanged).not.toHaveBeenCalled();
  });

  it('emits accountsChangedCA event when accounts are updated and skip updates when nothing changed', async () => {
    const permissions = {
      'example.com': {
        domain: 'example.com',
        accounts: { '0x123': NetworkVMType.EVM },
      },
    };

    const emitterExampleCom = getEventEmitter('example.com');
    const listener = jest.fn();
    emitterExampleCom.addListener(listener);

    emitterExampleCom.emitAccountsChanged(permissions['example.com']);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      method: Web3Event.ACCOUNTS_CHANGED_CA,
      params: [{ address: '0x123', vm: 'EVM' }],
    });

    emitterExampleCom.emitAccountsChanged(permissions['example.com']);
    expect(listener).toHaveBeenCalledTimes(1); // No more calls
  });
});
