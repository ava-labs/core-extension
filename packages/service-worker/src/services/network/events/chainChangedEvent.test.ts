import { Signal } from 'micro-signals';
import { runtime } from 'webextension-polyfill';

import { Web3Event } from '@core/types/src/models';

import { NetworkService } from '../NetworkService';

import { ChainChangedEvents } from './chainChangedEvent';

describe('src/background/services/network/events/chainChangedEvent', () => {
  let service: NetworkService;

  beforeEach(() => {
    service = {
      dappScopeChanged: new Signal(),
    } as any;
  });

  it('properly propagates events for synchronized dapps', () => {
    const listener = new ChainChangedEvents(service);
    const dappListener = jest.fn();

    listener.setConnectionInfo({
      domain: 'core.app',
    });

    listener.addListener(dappListener);

    service.dappScopeChanged.dispatch({
      domain: runtime.id,
      scope: 'eip155:1',
    });

    expect(dappListener).toHaveBeenCalledWith({
      method: Web3Event.CHAIN_CHANGED,
      params: {
        chainId: '0x1',
        networkVersion: '1',
      },
    });
  });

  it('propagates network change events to respective dapps', async () => {
    const listener = new ChainChangedEvents(service);
    const dappListener = jest.fn();

    listener.setConnectionInfo({
      domain: 'test.app',
    });

    listener.addListener(dappListener);

    service.dappScopeChanged.dispatch({
      domain: 'test.app',
      scope: 'eip155:1',
    });

    expect(dappListener).toHaveBeenCalledWith({
      method: Web3Event.CHAIN_CHANGED,
      params: {
        chainId: '0x1',
        networkVersion: '1',
      },
    });
  });

  it('does not propagate events if it does not concern the connected domain', async () => {
    const listener = new ChainChangedEvents(service);
    const dappListener = jest.fn();

    listener.setConnectionInfo({
      domain: 'test.app',
    });

    listener.addListener(dappListener);

    service.dappScopeChanged.dispatch({
      domain: 'different.app',
      scope: 'eip155:1',
    });

    expect(dappListener).not.toHaveBeenCalled();
  });
});
