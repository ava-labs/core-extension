import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { FUSION_QUERY_TOKENS, getFusionPath } from '@/config/routes';

const DRAFT_KEYS = [
  FUSION_QUERY_TOKENS.from,
  FUSION_QUERY_TOKENS.to,
  FUSION_QUERY_TOKENS.userAmount,
];

const getDraftSignature = (search: string) => {
  const params = new URLSearchParams(search);

  return DRAFT_KEYS.map((key) => `${key}=${params.get(key) ?? ''}`).join('&');
};

// Submitting a swap resolves long after the click, by which time the user may
// have left the swap page or started another swap. Call the hook's callback at
// submit to snapshot the draft; the function it returns clears the amount only
// if the user is still on that same draft. It reads `history.location` at call
// time because the render-time query is stale after the await.
export const useSwapDraftGuard = () => {
  const history = useHistory();

  return useCallback(() => {
    const submittedDraft = getDraftSignature(history.location.search);

    return (): boolean => {
      const { pathname, search } = history.location;

      if (
        pathname !== getFusionPath() ||
        getDraftSignature(search) !== submittedDraft
      ) {
        return false;
      }

      const params = new URLSearchParams(search);
      params.set(FUSION_QUERY_TOKENS.userAmount, '');
      history.replace({ pathname: getFusionPath(), search: params.toString() });

      return true;
    };
  }, [history]);
};
