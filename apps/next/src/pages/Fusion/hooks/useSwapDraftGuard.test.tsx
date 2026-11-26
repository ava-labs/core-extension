import { act, renderHook } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { PropsWithChildren } from 'react';
import { Router } from 'react-router-dom';

import { useSwapDraftGuard } from './useSwapDraftGuard';

const setup = (initialEntry: string) => {
  const history = createMemoryHistory({ initialEntries: [initialEntry] });
  const wrapper = ({ children }: PropsWithChildren) => (
    <Router history={history}>{children}</Router>
  );
  const { result } = renderHook(() => useSwapDraftGuard(), { wrapper });

  return { history, beginDraft: result.current };
};

describe('useSwapDraftGuard', () => {
  it('clears only the amount when the draft is unchanged', () => {
    const { history, beginDraft } = setup(
      '/fusion?from=a&to=b&userAmount=2&fromQ=x',
    );
    const complete = beginDraft();

    let applied: boolean | undefined;
    act(() => {
      applied = complete();
    });
    expect(applied).toBe(true);

    const params = new URLSearchParams(history.location.search);
    expect(history.location.pathname).toBe('/fusion');
    expect(params.get('userAmount')).toBe('');
    expect(params.get('from')).toBe('a');
    expect(params.get('to')).toBe('b');
    expect(params.get('fromQ')).toBe('x');
  });

  it('does nothing after the user navigated away', () => {
    const { history, beginDraft } = setup('/fusion?from=a&to=b&userAmount=2');
    const complete = beginDraft();
    act(() => {
      history.push('/');
    });

    let applied: boolean | undefined;
    act(() => {
      applied = complete();
    });
    expect(applied).toBe(false);
    expect(history.location.pathname).toBe('/');
  });

  it('does nothing when the draft changed in the meantime', () => {
    const { history, beginDraft } = setup('/fusion?from=a&to=b&userAmount=2');
    const complete = beginDraft();
    act(() => {
      history.replace('/fusion?from=a&to=c&userAmount=2');
    });

    let applied: boolean | undefined;
    act(() => {
      applied = complete();
    });
    expect(applied).toBe(false);
    expect(new URLSearchParams(history.location.search).get('to')).toBe('c');
  });
});
