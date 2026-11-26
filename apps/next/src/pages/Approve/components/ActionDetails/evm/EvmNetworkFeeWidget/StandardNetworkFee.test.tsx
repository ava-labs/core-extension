import { render } from '@testing-library/react';

import { useNetworkFeeContext } from '@core/ui';
import {
  TxDataUpdateProvider,
  useTxDataUpdate,
} from '@/pages/Approve/contexts';

import { StandardNetworkFee } from './StandardNetworkFee';
import { useEvmTransactionFee } from './hooks/useEvmTransactionFee';

jest.mock('@core/ui');
jest.mock('./hooks/useEvmTransactionFee');
jest.mock('./components', () => ({
  InsufficientFeeWarning: ({ visible }: { visible: boolean }) =>
    visible ? <div>insufficient</div> : null,
  ManualFeeControls: () => null,
}));
jest.mock('../../generic/DetailsSection', () => ({
  DetailsSection: ({ children }: any) => <div>{children}</div>,
}));

const Probe = ({ onUpdate }: { onUpdate: (v: boolean) => void }) => {
  onUpdate(useTxDataUpdate().isUpdating);
  return null;
};

const setup = (hasEnoughForNetworkFee: boolean) => {
  jest.mocked(useNetworkFeeContext).mockReturnValue({
    setGaslessDefaultValues: jest.fn(),
  } as any);
  jest.mocked(useEvmTransactionFee).mockReturnValue({
    isLoading: false,
    nativeToken: { balance: 1n },
    hasEnoughForNetworkFee,
  } as any);

  const states: boolean[] = [];
  const view = render(
    <TxDataUpdateProvider>
      <StandardNetworkFee action={{} as any} network={{} as any} />
      <Probe onUpdate={(v) => states.push(v)} />
    </TxDataUpdateProvider>,
  );

  return { states, view };
};

describe('StandardNetworkFee', () => {
  beforeEach(() => jest.resetAllMocks());

  it('blocks approval and shows the warning when funds are insufficient', () => {
    const { states, view } = setup(false);

    expect(states.at(-1)).toBe(true);
    expect(view.queryByText('insufficient')).not.toBeNull();
  });

  it('does not block approval when funds are sufficient', () => {
    const { states, view } = setup(true);

    expect(states.at(-1)).toBe(false);
    expect(view.queryByText('insufficient')).toBeNull();
  });
});
