import React from 'react';
import { Redirect } from 'react-router-dom';
import { useStore } from '@src/store/store';

export const FirstTimeFlow = () => {
  const { onboardStore } = useStore();

  if (onboardStore.onboardIsInProgress()) {
    return <Redirect to="/welcome/create" />;
  }

  if (!onboardStore.isOnboarded) {
    return <Redirect to="/welcome" />;
  }

  return <Redirect to="/wallet" />;
};
