import {
  ACTION_HANDLED_BY_MODULE,
  ActionStatus,
  ActionType,
  buildActionForRequest,
} from '@core/types';

describe('buildActionForRequest', () => {
  const request = {
    id: 'request-id',
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x1' }],
    site: { domain: 'example.com', tabId: 7 },
    tabId: 7,
  } as any;

  it('copies the fields the approval flow needs', () => {
    const action = buildActionForRequest(request, {
      scope: 'eip155:1',
      displayData: { network: 'Ethereum' },
    });

    expect(action).toEqual({
      id: 'request-id',
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
      site: { domain: 'example.com', tabId: 7 },
      type: ActionType.Single,
      scope: 'eip155:1',
      displayData: { network: 'Ethereum' },
    });
  });

  // Bounty #83628: a page controls every key on the request payload it hands to
  // the injected provider. Seeding `actionId` let it overwrite another pending
  // action, and seeding `signingData` + the module marker made a network-switch
  // approval sign an attacker-supplied transaction.
  it('drops privileged fields injected by the dApp', () => {
    const action = buildActionForRequest(
      {
        ...request,
        actionId: 'victims-pending-action-id',
        signingData: { type: 'eth_sendTransaction', data: {} },
        [ACTION_HANDLED_BY_MODULE]: true,
        status: ActionStatus.SUBMITTING,
        displayData: { spoofed: true },
        result: 'spoofed',
        popupWindowId: 1,
        dappInfo: { name: 'spoofed', url: 'https://spoofed', icon: '' },
      } as any,
      { scope: 'eip155:1', displayData: { network: 'Ethereum' } },
    );

    expect(action.actionId).toBeUndefined();
    expect((action as any).signingData).toBeUndefined();
    expect((action as any)[ACTION_HANDLED_BY_MODULE]).toBeUndefined();
    expect(action.status).toBeUndefined();
    expect(action.result).toBeUndefined();
    expect(action.popupWindowId).toBeUndefined();
    expect(action.dappInfo).toBeUndefined();
    expect(action.displayData).toEqual({ network: 'Ethereum' });
  });

  // The ACTION_UPDATED filter is scoped by tab, so a dApp-settable `tabId`
  // would let it subscribe to another tab's pending approvals. Only
  // `site.tabId` - which the middleware derives from the port sender - is
  // trustworthy.
  it('does not copy a dApp-supplied tabId or context', () => {
    const action = buildActionForRequest(
      {
        ...request,
        tabId: 999,
        context: { tabId: 999, swapAutoApprove: {} },
      } as any,
      { scope: 'eip155:1', displayData: {} },
    );

    expect(action.tabId).toBeUndefined();
    expect(action.context).toBeUndefined();
    expect(action.site?.tabId).toBe(7);
  });
});
