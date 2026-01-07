import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { useGetRequestId } from './useGetRequestId';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

describe('hooks/useGetRequestId', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns the id from parms', () => {
    (useLocation as jest.Mock).mockReturnValue({
      search: '?actionId=1234',
    });

    const { result } = renderHook(() => useGetRequestId());
    expect(result.current).toBe('1234');
  });

  it('returns the id when not the first param', () => {
    (useLocation as jest.Mock).mockReturnValue({
      search: '?something=otherthing&actionId=1234',
    });

    const { result } = renderHook(() => useGetRequestId());
    expect(result.current).toBe('1234');
  });

  it('returns empty string when id not present', () => {
    (useLocation as jest.Mock).mockReturnValue({
      search: '?something=otherthing&notId=1234',
    });

    const { result } = renderHook(() => useGetRequestId());
    expect(result.current).toBe('');
  });

  it('updates when the params change', () => {
    (useLocation as jest.Mock).mockReturnValue({
      search: '?actionId=1234',
    });

    const { result, rerender } = renderHook(() => useGetRequestId());

    expect(result.current).toEqual('1234');

    (useLocation as jest.Mock).mockReturnValue({
      search: '?actionId=4567',
    });
    rerender();

    expect(result.current).toEqual('4567');
  });
});
