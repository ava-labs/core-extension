import { renderHook } from '@testing-library/react';
import { FeatureVars } from '@core/types';
import { useFeatureFlagContext } from '../contexts/FeatureFlagsProvider';
import { LedgerAppType, useLedgerContext } from '../contexts/LedgerProvider';
import { useOutdatedLedgerAvalancheAppVersions } from './useOutdatedLedgerAvalancheAppVersions';

jest.mock('../contexts/FeatureFlagsProvider', () => ({
  useFeatureFlagContext: jest.fn(),
}));

jest.mock('../contexts/LedgerProvider', () => ({
  ...jest.requireActual('../contexts/LedgerProvider'),
  useLedgerContext: jest.fn(),
}));

describe('hooks/useOutdatedLedgerAvalancheAppVersions', () => {
  const selectFeatureFlag = jest.fn();

  const mockLedger = (appType: LedgerAppType, appVersion: string | null) =>
    jest.mocked(useLedgerContext).mockReturnValue({
      appType,
      appVersion,
    } as ReturnType<typeof useLedgerContext>);

  beforeEach(() => {
    jest.resetAllMocks();
    selectFeatureFlag.mockReturnValue('0.9.0');
    jest.mocked(useFeatureFlagContext).mockReturnValue({
      selectFeatureFlag,
    } as unknown as ReturnType<typeof useFeatureFlagContext>);
    mockLedger(LedgerAppType.AVALANCHE, '0.8.4');
  });

  it('returns both versions when the Avalanche app is older than the recommended version', () => {
    const { result } = renderHook(() =>
      useOutdatedLedgerAvalancheAppVersions(),
    );

    expect(result.current).toEqual({
      currentVersion: '0.8.4',
      recommendedVersion: '0.9.0',
    });
    expect(selectFeatureFlag).toHaveBeenCalledWith(
      FeatureVars.LEDGER_AVALANCHE_APP_RECOMMENDED_VERSION,
    );
  });

  it('returns undefined when the Avalanche app is up to date', () => {
    mockLedger(LedgerAppType.AVALANCHE, '0.9.0');

    const { result } = renderHook(() =>
      useOutdatedLedgerAvalancheAppVersions(),
    );

    expect(result.current).toBeUndefined();
  });

  it('returns undefined when the recommended version is not set', () => {
    selectFeatureFlag.mockReturnValue('');

    const { result } = renderHook(() =>
      useOutdatedLedgerAvalancheAppVersions(),
    );

    expect(result.current).toBeUndefined();
  });

  it('returns undefined when the app version cannot be read', () => {
    mockLedger(LedgerAppType.AVALANCHE, null);

    const { result } = renderHook(() =>
      useOutdatedLedgerAvalancheAppVersions(),
    );

    expect(result.current).toBeUndefined();
  });

  it.each([
    LedgerAppType.ETHEREUM,
    LedgerAppType.BITCOIN,
    LedgerAppType.SOLANA,
    LedgerAppType.DASHBOARD,
    LedgerAppType.UNKNOWN,
  ])('returns undefined when the active app is %s', (appType) => {
    mockLedger(appType, '0.0.1');

    const { result } = renderHook(() =>
      useOutdatedLedgerAvalancheAppVersions(),
    );

    expect(result.current).toBeUndefined();
  });
});
