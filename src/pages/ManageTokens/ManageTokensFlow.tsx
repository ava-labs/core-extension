import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { ManageTokensMiniMode } from './ManageTokens.minimode';

export const ManageTokensFlow = () => {
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  return isMiniMode ? <ManageTokensMiniMode /> : null;
};
