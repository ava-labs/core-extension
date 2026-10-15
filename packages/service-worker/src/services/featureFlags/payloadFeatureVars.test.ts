import { DISABLED_FLAG_VALUES } from '@core/common';
import { FeatureGates, FeatureVars } from '@core/types';
import {
  isPayloadFeatureVar,
  RawFeatureFlags,
  resolvePayloadFeatureVars,
} from './payloadFeatureVars';

const VAR = FeatureVars.LEDGER_AVALANCHE_APP_RECOMMENDED_VERSION;

const resolve = (
  value: RawFeatureFlags[typeof VAR],
  payload?: string,
  otherPayloads: Record<string, string> = {},
) =>
  resolvePayloadFeatureVars(
    { ...DISABLED_FLAG_VALUES, [FeatureGates.EVERYTHING]: true, [VAR]: value },
    payload === undefined
      ? otherPayloads
      : { ...otherPayloads, [VAR]: payload },
  );

describe('services/featureFlags/payloadFeatureVars', () => {
  describe('isPayloadFeatureVar', () => {
    it('identifies payload-backed vars', () => {
      expect(isPayloadFeatureVar(VAR)).toBe(true);
      expect(isPayloadFeatureVar(FeatureVars.SAE_OVERRIDE)).toBe(false);
      expect(isPayloadFeatureVar(FeatureGates.DEFI)).toBe(false);
    });
  });

  describe('resolvePayloadFeatureVars', () => {
    it('extracts the recommended version from an enabled flag', () => {
      const { flags } = resolve(
        true,
        JSON.stringify({ recommendedVersion: '1.2.3' }),
      );

      expect(flags[VAR]).toBe('1.2.3');
    });

    it('trims the extracted value', () => {
      const { flags } = resolve(
        true,
        JSON.stringify({ recommendedVersion: ' 1.2.3 ' }),
      );

      expect(flags[VAR]).toBe('1.2.3');
    });

    it.each([
      ['disabled', false],
      ['missing', undefined],
      ['a variant string', '1.2.3'],
      ['an empty string', ''],
    ])('resolves to an empty string when the flag is %s', (_, value) => {
      const { flags } = resolve(
        value,
        JSON.stringify({ recommendedVersion: '1.2.3' }),
      );

      expect(flags[VAR]).toBe('');
    });

    it.each([
      ['missing', undefined],
      ['not JSON', '{recommendedVersion: 1.2.3'],
      ['a bare string', JSON.stringify('1.2.3')],
      ['missing the version', JSON.stringify({ version: '1.2.3' })],
      ['a non-string version', JSON.stringify({ recommendedVersion: 123 })],
      ['null', 'null'],
    ])('resolves to an empty string when the payload is %s', (_, payload) => {
      const { flags } = resolve(true, payload);

      expect(flags[VAR]).toBe('');
    });

    it('strips payload-backed payloads and keeps the others', () => {
      const { flags, flagPayloads } = resolve(
        true,
        JSON.stringify({ recommendedVersion: '1.2.3' }),
        { [FeatureGates.DEFI]: JSON.stringify('>=1.60.0') },
      );

      expect(flagPayloads).toEqual({
        [FeatureGates.DEFI]: JSON.stringify('>=1.60.0'),
      });
      expect(flags).toEqual({
        ...DISABLED_FLAG_VALUES,
        [FeatureGates.EVERYTHING]: true,
        [VAR]: '1.2.3',
      });
    });

    it('does not mutate its inputs', () => {
      const rawFlags = { ...DISABLED_FLAG_VALUES, [VAR]: true };
      const payloads = {
        [VAR]: JSON.stringify({ recommendedVersion: '1.2.3' }),
      };

      resolvePayloadFeatureVars(rawFlags, payloads);

      expect(rawFlags[VAR]).toBe(true);
      expect(payloads[VAR]).toBeDefined();
    });
  });
});
