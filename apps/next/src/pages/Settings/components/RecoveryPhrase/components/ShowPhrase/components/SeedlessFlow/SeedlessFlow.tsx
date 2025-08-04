import { FC } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { stages } from './routes';

const [initialStage] = stages;

export const SeedlessFlow: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      {stages.map((stage) => (
        <Route
          key={stage.path}
          path={`${path}${stage.path}`}
          component={stage.Component}
        />
      ))}
      <Redirect from={path} to={`${path}${initialStage.path}`} />
    </Switch>
  );
};
