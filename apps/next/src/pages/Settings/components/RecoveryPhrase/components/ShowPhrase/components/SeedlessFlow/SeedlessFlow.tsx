import { ExportState, useSeedlessMnemonicExport } from '@core/ui';
import { FC } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { stages } from './routes';

export const SeedlessFlow: FC = () => {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { state } = useSeedlessMnemonicExport();
  const flatStages = Object.values(stages).flat(1);
  const currentStage = flatStages.find((stage) =>
    (stage.exportState as ExportState[]).includes(state),
  )!;

  if (!pathname.endsWith(currentStage.path)) {
    return <Redirect to={`${path}${currentStage.path}`} />;
  }

  return (
    <Switch>
      {flatStages.map((stage) => (
        <Route
          key={stage.path}
          path={`${path}${stage.path}`}
          component={stage.Component}
        />
      ))}
      <Redirect from={path} to={`${path}${currentStage.path}`} />
    </Switch>
  );
};
