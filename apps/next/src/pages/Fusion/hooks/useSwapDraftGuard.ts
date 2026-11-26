import { useCallback, useEffect, useRef } from 'react';
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
// time because the render-time query is stale after the await. `draftKey`
// covers draft inputs that live outside the query (active account, recurring
// schedule); it is read through a ref so the completion sees the latest value.
// Guards go stale on unmount so a late completion cannot clear a remounted form.
export const useSwapDraftGuard = (draftKey = '') => {
  const history = useHistory();
  const draftKeyRef = useRef(draftKey);
  draftKeyRef.current = draftKey;
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => {
    const submittedDraft = getDraftSignature(history.location.search);
    const submittedKey = draftKeyRef.current;

    return (): boolean => {
      const { pathname, search } = history.location;

      if (
        !isMountedRef.current ||
        pathname !== getFusionPath() ||
        getDraftSignature(search) !== submittedDraft ||
        draftKeyRef.current !== submittedKey
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
