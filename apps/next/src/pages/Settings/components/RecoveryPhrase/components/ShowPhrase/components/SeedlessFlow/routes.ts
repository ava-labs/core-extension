import { createElement } from 'react';
import { AuthorizeAccess } from './components/AuthorizeAccess';
import { ExportInfo } from './components/ExportInfo';
import { RequestExport } from './components/RequestExport';

type Stage = {
  Component: React.ComponentType;
  path: string;
  next: string;
};

export const stages = [
  {
    Component: ExportInfo,
    path: '/export-info',
    next: '/authorize-access',
  },
  {
    Component: AuthorizeAccess,
    path: '/authorize-access',
    next: '/request-export',
  },
  {
    Component: RequestExport,
    path: '/request-export',
    next: '/pending-export',
  },
  {
    Component: () => createElement('div', null, 'Implement me'),
    path: '/pending-export',
    next: '/show-phrase',
  },
  {
    Component: () => createElement('div', null, 'Implement me'),
    path: '/show-phrase',
    next: '/',
  },
] as const satisfies Stage[];
