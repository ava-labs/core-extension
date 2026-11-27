import { useState } from 'react';

import { type FungibleTokenBalance } from '@core/types';

type UseEffectiveTargetTokenParams = {
  targetToken: FungibleTokenBalance | undefined;
  candidateTargetToken: FungibleTokenBalance | undefined;
  provisionalTargetToken: FungibleTokenBalance | undefined;
  isTargetSelectOpen: boolean;
  isTargetTokenListFetching: boolean;
  sourceTokenId: string | undefined;
};

export const useEffectiveTargetToken = ({
  targetToken,
  candidateTargetToken,
  provisionalTargetToken,
  isTargetSelectOpen,
  isTargetTokenListFetching,
  sourceTokenId,
}: UseEffectiveTargetTokenParams): FungibleTokenBalance | undefined => {
  const [wasTargetSelectOpen, setWasTargetSelectOpen] =
    useState(isTargetSelectOpen);
  const [openingSnapshot, setOpeningSnapshot] = useState<
    FungibleTokenBalance | undefined
  >(isTargetSelectOpen ? provisionalTargetToken : undefined);

  const [previousSourceTokenId, setPreviousSourceTokenId] =
    useState(sourceTokenId);

  const hasSourceChanged = previousSourceTokenId !== sourceTokenId;
  const hasOpenStateChanged = wasTargetSelectOpen !== isTargetSelectOpen;
  const shouldReleaseSnapshot =
    !isTargetSelectOpen && !isTargetTokenListFetching;

  if (hasSourceChanged) {
    setPreviousSourceTokenId(sourceTokenId);
  }
  if (hasOpenStateChanged) {
    setWasTargetSelectOpen(isTargetSelectOpen);
  }
  if (hasOpenStateChanged && isTargetSelectOpen) {
    setOpeningSnapshot(provisionalTargetToken);
  } else if (openingSnapshot && (hasSourceChanged || shouldReleaseSnapshot)) {
    setOpeningSnapshot(undefined);
  }

  if (isTargetSelectOpen) {
    return targetToken ?? provisionalTargetToken ?? openingSnapshot;
  }

  return (
    targetToken ??
    candidateTargetToken ??
    provisionalTargetToken ??
    (isTargetTokenListFetching && !hasSourceChanged
      ? openingSnapshot
      : undefined)
  );
};
