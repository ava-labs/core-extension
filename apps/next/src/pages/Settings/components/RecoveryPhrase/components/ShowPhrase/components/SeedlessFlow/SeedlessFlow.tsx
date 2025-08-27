import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';
import { ContextContainer } from '@core/types';
import {
  ExportState,
  isSpecificContextContainer,
  useSeedlessMnemonicExport,
} from '@core/ui';
import { FC } from 'react';
import { Error } from './pages/Error';
import { Exported } from './pages/Exported';
import { ExportEntryPoint } from './pages/ExportEntryPoint';
import { LoadingState } from './pages/Loading';
import { MFA } from './pages/MFA';
import { ReadyToExport } from './pages/ReadyToExport';
import { WaitingLounge } from './pages/WaitingLounge/WaitingLounge';
import { StageProps } from './types';

const stages: Record<ExportState, FC<StageProps>> = {
  [ExportState.Loading]: LoadingState,
  [ExportState.NotInitiated]: ExportEntryPoint,
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

  return (
    <>
      {isFullscreen && <FullscreenAnimatedBackground />}
      <Component {...exportState} fullscreen={isFullscreen} />
    </>
  );
};
