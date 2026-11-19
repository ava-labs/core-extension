import { ThemeProvider } from '@avalabs/k2-alpine';
import { act, fireEvent, render, screen } from '@shared/tests/test-utils';
import { ReactNode } from 'react';

import { ActionDrawer } from '../components/ActionDrawer';
import { useFullScrollReview } from './useFullScrollReview';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

type Metrics = {
  scrollHeight: number;
  clientHeight: number;
  scrollTop: number;
};

// jsdom has no layout, so scroll metrics are served from this map, keyed by
// the element's data-testid.
const metrics = new Map<string, Metrics>();
const metricsOf = (el: HTMLElement) =>
  metrics.get(el.dataset?.testid ?? '') ?? {
    scrollHeight: 0,
    clientHeight: 0,
    scrollTop: 0,
  };

const originalDescriptors = {
  scrollHeight: Object.getOwnPropertyDescriptor(
    Element.prototype,
    'scrollHeight',
  ),
  clientHeight: Object.getOwnPropertyDescriptor(
    Element.prototype,
    'clientHeight',
  ),
  scrollTop: Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop'),
};

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return metricsOf(this).scrollHeight;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return metricsOf(this).clientHeight;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
    configurable: true,
    get(this: HTMLElement) {
      return metricsOf(this).scrollTop;
    },
    set(this: HTMLElement, value: number) {
      const m = metrics.get(this.dataset?.testid ?? '');
      if (m) m.scrollTop = value;
    },
  });
});

afterAll(() => {
  for (const [key, descriptor] of Object.entries(originalDescriptors)) {
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)[key];
    if (descriptor) Object.defineProperty(Element.prototype, key, descriptor);
  }
});

beforeEach(() => {
  metrics.clear();
  jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const approve = jest.fn();
const reject = jest.fn();

const Harness = ({ message }: { message: ReactNode }) => {
  const { containerRef, hasReviewedAll } = useFullScrollReview();
  return (
    <div ref={containerRef}>
      <div data-testid="outer" style={{ overflowY: 'auto' }}>
        <div data-testid="inner" style={{ overflowY: 'auto' }}>
          {message}
        </div>
        <ActionDrawer
          open
          approve={approve}
          reject={reject}
          isProcessing={false}
          isDisabled={!hasReviewedAll}
          approveHint={
            hasReviewedAll ? undefined : 'Scroll to review the full message'
          }
        />
      </div>
    </div>
  );
};

const renderHarness = async (message: ReactNode = 'message') => {
  let result!: ReturnType<typeof render>;
  await act(async () => {
    result = render(
      <ThemeProvider theme="light" toastVariant="extension">
        <Harness message={message} />
      </ThemeProvider>,
    );
  });
  return result;
};

const setMetrics = (testId: string, m: Metrics) => metrics.set(testId, m);

const scrollTo = async (testId: string, scrollTop: number) => {
  const el = screen.getByTestId(testId);
  await act(async () => {
    el.scrollTop = scrollTop;
    fireEvent.scroll(el);
  });
};

const approveButton = () =>
  screen.getByTestId('approve-action-button') as HTMLButtonElement;
const rejectButton = () =>
  screen.getByTestId('reject-action-button') as HTMLButtonElement;
const hint = () => screen.queryByTestId('approve-action-hint');

describe('useFullScrollReview + ActionDrawer', () => {
  it('disables approve and shows a hint while the message overflows', async () => {
    setMetrics('outer', {
      scrollHeight: 1000,
      clientHeight: 500,
      scrollTop: 0,
    });
    setMetrics('inner', { scrollHeight: 800, clientHeight: 200, scrollTop: 0 });

    await renderHarness();

    expect(approveButton().disabled).toBe(true);
    expect(hint()?.textContent).toBe('Scroll to review the full message');
    expect(rejectButton().disabled).toBe(false);
  });

  it('stays disabled until both the outer page and the inner message are scrolled to the end', async () => {
    setMetrics('outer', {
      scrollHeight: 1000,
      clientHeight: 500,
      scrollTop: 0,
    });
    setMetrics('inner', { scrollHeight: 800, clientHeight: 200, scrollTop: 0 });
    await renderHarness();

    await scrollTo('outer', 500);
    expect(approveButton().disabled).toBe(true);

    await scrollTo('inner', 300);
    expect(approveButton().disabled).toBe(true);

    await scrollTo('inner', 600);
    expect(approveButton().disabled).toBe(false);
    expect(hint()).toBeNull();

    fireEvent.click(approveButton());
    expect(approve).toHaveBeenCalledTimes(1);
  });

  it('accepts a small tolerance at the bottom', async () => {
    setMetrics('outer', {
      scrollHeight: 1000,
      clientHeight: 500,
      scrollTop: 0,
    });
    await renderHarness();

    await scrollTo('outer', 497);
    expect(approveButton().disabled).toBe(false);
  });

  it('enables approve immediately when the content fits without scrolling', async () => {
    setMetrics('outer', { scrollHeight: 400, clientHeight: 500, scrollTop: 0 });
    setMetrics('inner', { scrollHeight: 150, clientHeight: 150, scrollTop: 0 });

    await renderHarness();

    expect(approveButton().disabled).toBe(false);
    expect(hint()).toBeNull();
  });

  it('ignores overflowing elements that the user cannot scroll', async () => {
    setMetrics('outer', { scrollHeight: 400, clientHeight: 500, scrollTop: 0 });
    await renderHarness(
      <div data-testid="clipped" style={{ overflowY: 'hidden' }}>
        clipped
      </div>,
    );
    setMetrics('clipped', {
      scrollHeight: 900,
      clientHeight: 100,
      scrollTop: 0,
    });
    await scrollTo('outer', 0);

    expect(approveButton().disabled).toBe(false);
  });

  it('does not re-disable when scrolling back up after reaching the end', async () => {
    setMetrics('outer', {
      scrollHeight: 1000,
      clientHeight: 500,
      scrollTop: 0,
    });
    await renderHarness();

    await scrollTo('outer', 500);
    expect(approveButton().disabled).toBe(false);

    await scrollTo('outer', 0);
    expect(approveButton().disabled).toBe(false);
  });

  it('re-disables only when new content extends beyond the furthest point reached', async () => {
    setMetrics('outer', {
      scrollHeight: 1000,
      clientHeight: 500,
      scrollTop: 0,
    });
    const { rerender } = await renderHarness('short');

    await scrollTo('outer', 500);
    expect(approveButton().disabled).toBe(false);

    // Re-measure with the same height: still enabled.
    await act(async () => {
      rerender(
        <ThemeProvider theme="light" toastVariant="extension">
          <Harness message="short, re-rendered" />
        </ThemeProvider>,
      );
    });
    await scrollTo('outer', 500);
    expect(approveButton().disabled).toBe(false);

    // Content grows beyond what was reviewed: locked again.
    setMetrics('outer', {
      scrollHeight: 1600,
      clientHeight: 500,
      scrollTop: 500,
    });
    await act(async () => {
      rerender(
        <ThemeProvider theme="light" toastVariant="extension">
          <Harness message="much longer content" />
        </ThemeProvider>,
      );
    });
    expect(approveButton().disabled).toBe(true);

    await scrollTo('outer', 1100);
    expect(approveButton().disabled).toBe(false);
  });

  it('keeps reject enabled regardless of scroll state', async () => {
    setMetrics('outer', {
      scrollHeight: 5000,
      clientHeight: 500,
      scrollTop: 0,
    });
    await renderHarness();

    expect(rejectButton().disabled).toBe(false);
    fireEvent.click(rejectButton());
    expect(reject).toHaveBeenCalledTimes(1);
  });
});
