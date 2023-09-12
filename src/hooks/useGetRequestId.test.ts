import { renderHook } from '@testing-library/react-hooks';
import { useHistory } from 'react-router-dom';
import { useGetRequestId } from './useGetRequestId';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

describe('hooks/useGetRequestId', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns the id from parms', () => {
    (useHistory as jest.Mock).mockReturnValue({
      location: {
        search: '?actionId=1234',
      },
    });

    const { result } = renderHook(() => useGetRequestId());
    expect(result.current).toBe('1234');
  });

  it('returns the id when not the first param', () => {
    (useHistory as jest.Mock).mockReturnValue({
      location: {
        search: '?something=otherthing&actionId=1234',
      },
    });

    const { result } = renderHook(() => useGetRequestId());
    expect(result.current).toBe('1234');
  });

  it('returns empty string when id not present', () => {
    (useHistory as jest.Mock).mockReturnValue({
      location: {
        search: '?something=otherthing&notId=1234',
      },
    });

    const { result } = renderHook(() => useGetRequestId());
    expect(result.current).toBe('');
  });

  it('updates when the params change', () => {
    (useHistory as jest.Mock).mockReturnValue({
      location: {
        search: '?actionId=1234',
      },
    });

    const { result, rerender } = renderHook(() => useGetRequestId());

    (useHistory as jest.Mock).mockReturnValue({
      location: {
        search: '?actionId=4567',
      },
    });
    rerender();

    expect(result.all).toEqual(['1234', '4567']);
  });
});
