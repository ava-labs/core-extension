import { ContextContainer } from '@core/types';
import {
  ExportErrorCode,
  ExportState,
  isSpecificContextContainer,
  useSeedlessMnemonicExport,
} from '@core/ui';
import { createElement, FC } from 'react';
import { ExportInfo } from './components/ExportInfo';
import { LoadingState } from './components/Loading';
import { MFA } from './components/MFA';
import { WaitingLounge } from './components/WaitingLounge/WaitingLounge';
import { StageProps } from './types';

const stages: Record<number, FC<StageProps>> = {
  [ExportState.Loading]: LoadingState,
  [ExportState.NotInitiated]: ExportInfo,
  [ExportState.Initiating]: MFA,
  [ExportState.Pending]: WaitingLounge,
  [ExportState.Cancelling]: WaitingLounge,
  [ExportState.ReadyToExport]: (props) => {
    const { completeExport, cancelExport } = props;

    return (
      <div>
        <button onClick={completeExport}>Complete Export</button>
        <button onClick={cancelExport}>Cancel Export</button>
      </div>
    );
  },
  [ExportState.Exported]: () =>
    createElement('div', null, 'Exported State Placeholder 2'),
  [ExportState.Exporting]: ({ completeExport, cancelExport }) => {
    return (
      <div>
        <button onClick={completeExport}>Complete Export</button>
        <button onClick={cancelExport}>Cancel Export</button>
      </div>
    );
  },
  [ExportState.Error]: ({ error }) => (
    <div>Dupson: {error ? ExportErrorCode[error] : 'No error'} </div>
  ),
};

export const SeedlessFlow: FC = () => {
  const exportState = useSeedlessMnemonicExport();
  const isFullscreen = isSpecificContextContainer(ContextContainer.FULLSCREEN);
  const Component = stages[exportState.state] ?? stages[ExportState.Loading]!;

  return (
    <Component
      key={exportState.state}
      {...exportState}
      fullscreen={isFullscreen}
    />
  );
};
