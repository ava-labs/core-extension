import { render } from '@testing-library/react';

import {
  TxDataUpdateProvider,
  useTxDataUpdate,
} from '@/pages/Approve/contexts';
import { useGasless } from '../../../../hooks';

import { GaslessNetworkFee } from './GaslessNetworkFee';
import { useEvmTransactionFee } from './hooks/useEvmTransactionFee';

jest.mock('../../../../hooks');
jest.mock('./hooks/useEvmTransactionFee');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (s: string) => s }),
}));
jest.mock('./components', () => ({
  GaslessSwitchRow: () => null,
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

const setup = ({
  hasEnoughForNetworkFee,
  isGaslessOn,
}: {
  hasEnoughForNetworkFee: boolean;
  isGaslessOn: boolean;
}) => {
  jest.mocked(useGasless).mockReturnValue({
    isGaslessOn,
    setIsGaslessOn: jest.fn(),
    gaslessPhase: 'NOT_READY',
    isGaslessEligible: false,
  } as any);
  jest.mocked(useEvmTransactionFee).mockReturnValue({
    isLoading: false,
    nativeToken: { balance: 1n },
    hasEnoughForNetworkFee,
    choosePreset: jest.fn(),
  } as any);

  const states: boolean[] = [];
  const view = render(
    <TxDataUpdateProvider>
      <GaslessNetworkFee action={{} as any} network={{} as any} />
      <Probe onUpdate={(v) => states.push(v)} />
    </TxDataUpdateProvider>,
  );

  return { states, view };
};

describe('GaslessNetworkFee', () => {
  beforeEach(() => jest.resetAllMocks());

  it('blocks approval when funds are insufficient and gasless is off', () => {
    const { states, view } = setup({
      hasEnoughForNetworkFee: false,
      isGaslessOn: false,
    });

    expect(states.at(-1)).toBe(true);
    expect(view.queryByText('insufficient')).not.toBeNull();
  });

  it('does not block approval when gas funding is on', () => {
    const { states } = setup({
      hasEnoughForNetworkFee: false,
      isGaslessOn: true,
    });

    expect(states.at(-1)).toBe(false);
  });

  it('does not block approval when funds are sufficient', () => {
    const { states } = setup({
      hasEnoughForNetworkFee: true,
      isGaslessOn: false,
    });

    expect(states.at(-1)).toBe(false);
  });
});
