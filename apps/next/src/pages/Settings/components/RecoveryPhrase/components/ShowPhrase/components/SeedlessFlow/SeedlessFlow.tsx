import { ContextContainer } from '@core/types';
import {
  ExportState,
  isSpecificContextContainer,
  useSeedlessMnemonicExport,
} from '@core/ui';
import { FC } from 'react';
import { Error } from './components/Error';
import { Exported } from './components/Exported';
import { ExportInfo } from './components/ExportInfo';
import { LoadingState } from './components/Loading';
import { MFA } from './components/MFA';
import { ReadyToExport } from './components/ReadyToExport';
import { WaitingLounge } from './components/WaitingLounge/WaitingLounge';
import { StageProps } from './types';

const stages: Record<ExportState, FC<StageProps>> = {
  [ExportState.Loading]: LoadingState,
  [ExportState.NotInitiated]: ExportInfo,
  [ExportState.Initiating]: MFA,
  [ExportState.Pending]: WaitingLounge,
  [ExportState.Cancelling]: WaitingLounge,
  [ExportState.ReadyToExport]: ReadyToExport,
  [ExportState.Exporting]: MFA,
  [ExportState.Exported]: Exported,
  [ExportState.Error]: Error,
};

export const SeedlessFlow: FC = () => {
  const exportState = useSeedlessMnemonicExport();
  const isFullscreen = isSpecificContextContainer(ContextContainer.FULLSCREEN);
  const Component = stages[exportState.state] ?? stages[ExportState.Loading];

  return <Component {...exportState} fullscreen={isFullscreen} />;
};
