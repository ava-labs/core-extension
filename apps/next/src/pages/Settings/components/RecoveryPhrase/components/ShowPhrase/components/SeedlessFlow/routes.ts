import { ExportState } from '@core/ui';
import { createElement } from 'react';
import { ExportInfo } from './components/ExportInfo';
import { LoadingState } from './components/Loading';
import { MFAAuthentication } from './components/MFAAuthentication';
import { WaitingLounge } from './components/WaitingLounge';

type Stage = {
  Component: React.ComponentType;
  path: string;
  next: string;
  exportState: [ExportState, ...ExportState[]];
};

export type ValidateStages<
  S extends [Stage, ...Stage[]],
  Original = S,
> = S extends [
  infer First extends Stage,
  infer Second extends Stage,
  ...infer Rest extends Stage[],
]
  ? First['next'] extends Second['path']
    ? ValidateStages<[Second, ...Rest], Original>
    : never
  : Original;

const stagesDraft = [
  {
    Component: ExportInfo,
    path: '/export-disclaimer',
    next: '/mfa-auth',
    exportState: [ExportState.NotInitiated],
  },
  {
    Component: MFAAuthentication,
    path: '/mfa-auth',
    next: '/request-export',
    exportState: [ExportState.Initiating],
  },

  {
    Component: WaitingLounge,
    path: '/pending-export',
    next: '/show-phrase',
    exportState: [ExportState.Pending, ExportState.Cancelling],
  },
  {
    Component: () => createElement('div', null, 'Exported State Placeholder'),
    path: '/show-phrase',
    next: '/',
    exportState: [ExportState.ReadyToExport, ExportState.Exported],
  },
] as const satisfies Stage[];

export const stages = {
  flow: stagesDraft, // satisfies ValidateStages<typeof stagesDraft>,
  loading: {
    Component: LoadingState,
    path: '/loading',
    next: '/',
    exportState: [ExportState.Loading],
  },
  error: {
    Component: () => createElement('div', null, 'Error State Placeholder'),
    path: '/error',
    next: '/',
    exportState: [ExportState.Error],
  },
} as const;
