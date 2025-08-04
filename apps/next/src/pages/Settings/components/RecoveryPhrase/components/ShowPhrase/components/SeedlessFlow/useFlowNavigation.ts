import { useHistory } from 'react-router-dom';
import { stages } from './routes';

type UseFlowNavigationConfig = {
  useReplace?: boolean;
};

export function useFlowNavigation({
  useReplace = true,
}: UseFlowNavigationConfig = {}) {
  const { location, push, replace, goBack } = useHistory();
  const navigate = useReplace ? replace : push;

  const getNextStageUrl = () => {
    const segments = location.pathname.split('/');
    const currentStage = segments.pop()!;
    const nextStage = stages.flow.find(({ path }) =>
      path.endsWith(currentStage),
    )!;
    return `${segments.join('/')}${nextStage.next}`;
  };

  const navigateToNextStage = () => navigate(getNextStageUrl());

  const leave = () => {
    push('/settings');
  };

  return {
    getNextStageUrl,
    navigateToNextStage,
    leave,
    goBack,
  };
}
