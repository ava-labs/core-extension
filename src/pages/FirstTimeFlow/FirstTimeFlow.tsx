import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useStore } from '@src/store/store';
import { onboardingService } from '@src/background/services';
import { OnboardingState } from '@src/background/services/onboarding/models';
import { LoadingIcon } from '@avalabs/react-components';
import { useEffect } from 'react';

export const FirstTimeFlow = () => {
  const [onboardingState, setOnboardingState] =
    useState<{ isInProgress: boolean; isOnboarded: boolean }>();

  useEffect(() => {
    Promise.all([
      onboardingService.onboardIsInProgress(),
      onboardingService.onboarding
        .promisify()
        .then((onboarding) => onboarding.isOnBoarded),
    ]).then(([isInProgress, isOnboarded]) => {
      setOnboardingState({ isInProgress, isOnboarded });
    });
  }, []);

  if (!onboardingState) {
    return <LoadingIcon />;
  }

  if (onboardingState.isInProgress) {
    return <Redirect to="/welcome/create" />;
  }

  if (!onboardingState.isOnboarded) {
    return <Redirect to="/welcome" />;
  }

  return <Redirect to="/wallet" />;
};
