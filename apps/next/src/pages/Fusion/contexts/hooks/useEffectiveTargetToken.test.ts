import { renderHook } from '@testing-library/react';

import { type FungibleTokenBalance } from '@core/types';

import { useEffectiveTargetToken } from './useEffectiveTargetToken';

const token = (symbol: string) => ({ symbol }) as FungibleTokenBalance;

const committed = token('COMMITTED');
const candidate = token('CANDIDATE');
const provisional = token('PROVISIONAL');
const picked = token('PICKED');

type Params = Parameters<typeof useEffectiveTargetToken>[0];

const render = (initialProps: Params) =>
  renderHook((props: Params) => useEffectiveTargetToken(props), {
    initialProps,
  });

const closed: Params = {
  targetToken: undefined,
  candidateTargetToken: undefined,
  provisionalTargetToken: undefined,
  isTargetSelectOpen: false,
  isTargetTokenListFetching: false,
  sourceTokenId: 'source',
};

describe('useEffectiveTargetToken', () => {
  describe('select closed', () => {
    it('prefers the committed target', () => {
      const { result } = render({
        ...closed,
        targetToken: committed,
        candidateTargetToken: candidate,
        provisionalTargetToken: provisional,
      });

      expect(result.current).toBe(committed);
    });

    it('falls back to the candidate, then to the provisional token', () => {
      const { result, rerender } = render({
        ...closed,
        candidateTargetToken: candidate,
        provisionalTargetToken: provisional,
      });
      expect(result.current).toBe(candidate);

      rerender({ ...closed, provisionalTargetToken: provisional });
      expect(result.current).toBe(provisional);

      rerender(closed);
      expect(result.current).toBeUndefined();
    });
  });

  describe('select open', () => {
    it('ignores the candidate', () => {
      const { result } = render({
        ...closed,
        isTargetSelectOpen: true,
        candidateTargetToken: candidate,
      });

      expect(result.current).toBeUndefined();
    });

    it('keeps the provisional token captured on open after it disappears', () => {
      const { result, rerender } = render({
        ...closed,
        provisionalTargetToken: provisional,
      });

      rerender({
        ...closed,
        provisionalTargetToken: provisional,
        isTargetSelectOpen: true,
      });
      expect(result.current).toBe(provisional);

      rerender({ ...closed, isTargetSelectOpen: true });
      expect(result.current).toBe(provisional);
    });

    it('lets an explicit target win over the snapshot', () => {
      const { result, rerender } = render({
        ...closed,
        provisionalTargetToken: provisional,
      });

      rerender({
        ...closed,
        provisionalTargetToken: provisional,
        isTargetSelectOpen: true,
      });
      rerender({ ...closed, isTargetSelectOpen: true, targetToken: picked });

      expect(result.current).toBe(picked);
    });

    it('does not snapshot a provisional token that appears while open', () => {
      const { result, rerender } = render({
        ...closed,
        isTargetSelectOpen: true,
      });

      rerender({
        ...closed,
        isTargetSelectOpen: true,
        provisionalTargetToken: provisional,
      });
      expect(result.current).toBe(provisional);

      rerender({ ...closed, isTargetSelectOpen: true });
      expect(result.current).toBeUndefined();
    });
  });

  describe('close transitions', () => {
    const openWithSnapshot = () => {
      const hook = render({ ...closed, provisionalTargetToken: provisional });
      hook.rerender({
        ...closed,
        provisionalTargetToken: provisional,
        isTargetSelectOpen: true,
      });
      hook.rerender({ ...closed, isTargetSelectOpen: true });
      return hook;
    };

    it('clears the snapshot on close when the list is not fetching', () => {
      const { result, rerender } = openWithSnapshot();
      expect(result.current).toBe(provisional);

      rerender({ ...closed, candidateTargetToken: candidate });
      expect(result.current).toBe(candidate);

      rerender(closed);
      expect(result.current).toBeUndefined();
    });

    it('keeps the snapshot while the committed list is still fetching', () => {
      const { result, rerender } = openWithSnapshot();

      rerender({ ...closed, isTargetTokenListFetching: true });
      expect(result.current).toBe(provisional);

      rerender(closed);
      expect(result.current).toBeUndefined();
    });

    it('does not resurrect the snapshot once released', () => {
      const { result, rerender } = openWithSnapshot();

      rerender({ ...closed, isTargetTokenListFetching: true });
      rerender(closed);
      rerender({ ...closed, isTargetTokenListFetching: true });

      expect(result.current).toBeUndefined();
    });

    it('prefers the candidate once it appears while fetching', () => {
      const { result, rerender } = openWithSnapshot();

      rerender({ ...closed, isTargetTokenListFetching: true });
      rerender({
        ...closed,
        isTargetTokenListFetching: true,
        candidateTargetToken: candidate,
      });

      expect(result.current).toBe(candidate);
    });

    it('drops the snapshot when the source token changes', () => {
      const { result, rerender } = openWithSnapshot();

      rerender({ ...closed, isTargetTokenListFetching: true });
      expect(result.current).toBe(provisional);

      rerender({
        ...closed,
        isTargetTokenListFetching: true,
        sourceTokenId: 'other-source',
      });
      expect(result.current).toBeUndefined();

      rerender({ ...closed, isTargetTokenListFetching: true });
      expect(result.current).toBeUndefined();
    });
  });
});
