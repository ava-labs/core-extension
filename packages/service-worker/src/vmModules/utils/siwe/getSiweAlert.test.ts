import { AlertType, RpcMethod } from '@avalabs/vm-module-types';
import type {
  DisplayData,
  RpcRequest,
  SigningData,
} from '@avalabs/vm-module-types';

import { maybeInjectSiweAlert } from './getSiweAlert';

const toHex = (message: string) =>
  `0x${Buffer.from(message, 'utf8').toString('hex')}`;

const buildSiweMessage = (domain: string, uri: string) =>
  `${domain} wants you to sign in with your Ethereum account:
0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

Sign in to Example App

URI: ${uri}
Version: 1
Chain ID: 1
Nonce: 32891756
Issued At: 2021-09-30T16:25:24Z`;

const buildRequest = (url: string): RpcRequest =>
  ({
    dappInfo: {
      icon: 'icon',
      name: 'name',
      url,
    },
  }) as RpcRequest;

const buildSigningData = (message: string): SigningData => ({
  type: RpcMethod.PERSONAL_SIGN,
  account: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  data: toHex(message),
});

const displayData: DisplayData = {
  title: 'Sign Message',
  details: [],
};

describe('maybeInjectSiweAlert', () => {
  it('injects a DANGER alert when SIWE domain does not match the dApp origin', () => {
    const result = maybeInjectSiweAlert({
      request: buildRequest('https://example.com'),
      signingData: buildSigningData(
        buildSiweMessage('evil.com', 'https://evil.com/login'),
      ),
      displayData,
    });

    expect(result.alert).toBeDefined();
    expect(result.alert?.type).toBe(AlertType.DANGER);
    expect(result.alert?.details.title).toBe('Sign-In Request Mismatch');
  });

  it('returns displayData untouched when SIWE domain matches the dApp origin', () => {
    const result = maybeInjectSiweAlert({
      request: buildRequest('https://example.com'),
      signingData: buildSigningData(
        buildSiweMessage('example.com', 'https://example.com/login'),
      ),
      displayData,
    });

    expect(result).toBe(displayData);
  });

  it('ignores methods other than personal_sign', () => {
    const result = maybeInjectSiweAlert({
      request: buildRequest('https://example.com'),
      signingData: {
        type: RpcMethod.ETH_SIGN,
        account: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        data: toHex(buildSiweMessage('evil.com', 'https://evil.com/login')),
      },
      displayData,
    });

    expect(result).toBe(displayData);
  });

  it('does not override an existing alert (e.g. from Blockaid)', () => {
    const existingAlert = {
      type: AlertType.WARNING,
      details: {
        title: 'Existing alert',
        description: 'Existing description',
      },
    };
    const result = maybeInjectSiweAlert({
      request: buildRequest('https://example.com'),
      signingData: buildSigningData(
        buildSiweMessage('evil.com', 'https://evil.com/login'),
      ),
      displayData: { ...displayData, alert: existingAlert },
    });

    expect(result.alert).toBe(existingAlert);
  });

  it('ignores messages that are not SIWE', () => {
    const result = maybeInjectSiweAlert({
      request: buildRequest('https://example.com'),
      signingData: buildSigningData('Hello world'),
      displayData,
    });

    expect(result).toBe(displayData);
  });

  it('handles plain-text (non-hex) personal_sign payloads', () => {
    const result = maybeInjectSiweAlert({
      request: buildRequest('https://example.com'),
      signingData: {
        type: RpcMethod.PERSONAL_SIGN,
        account: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        data: 'Hello world',
      },
      displayData,
    });

    expect(result).toBe(displayData);
  });
});
