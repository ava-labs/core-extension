import { Network } from '@avalabs/core-chains-sdk';
import { SettingsState } from '@core/types';
import { isCustomTokenAdded } from './isCustomTokenAdded';

const network = { chainId: 43114 } as Network;

const settingsWith = (customTokens: SettingsState['customTokens']) =>
  ({ customTokens }) as SettingsState;

describe('isCustomTokenAdded', () => {
  it('returns true when the token is already added as a custom token', () => {
    const settings = settingsWith({
      43114: { '0xabc': { address: '0xAbC' } as any },
    });

    expect(isCustomTokenAdded('0xAbC', network, settings)).toBe(true);
  });

  it('matches custom tokens case-insensitively', () => {
    const settings = settingsWith({
      43114: { '0xabc': { address: '0xabc' } as any },
    });

    expect(isCustomTokenAdded('0xABC', network, settings)).toBe(true);
  });

  it('returns false when the token is not a custom token on this chain', () => {
    const settings = settingsWith({ 1: { '0xabc': {} as any } });

    expect(isCustomTokenAdded('0xabc', network, settings)).toBe(false);
  });

  it('returns false when there are no custom tokens', () => {
    expect(isCustomTokenAdded('0xabc', network, settingsWith({}))).toBe(false);
  });
});
