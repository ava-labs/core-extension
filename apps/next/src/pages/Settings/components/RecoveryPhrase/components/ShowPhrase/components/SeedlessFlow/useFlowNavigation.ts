import { useHistory } from 'react-router-dom';
import { stages } from './routes';

type UseFlowNavigationConfig = {
  useReplace?: boolean;
};

export function useFlowNavigation({
  useReplace = true,
}: UseFlowNavigationConfig = {}) {
  const { location, push, replace } = useHistory();
  const navigate = useReplace ? replace : push;

  const navigateToNextStage = () => {
    const segments = location.pathname.split('/');
    const currentStage = segments.pop()!;
    const nextStage = stages.find(({ path }) => path.endsWith(currentStage))!;
    const nextUrl = `${segments.join('/')}${nextStage.next}`;

    navigate(nextUrl);
  };

  const leave = () => {
    push('/settings');
  };

  return {
    navigateToNextStage,
    leave,
  };
}
