import React from 'react';
import { Redirect } from 'react-router-dom';
import { useStore } from '@src/store/store';

export const FirstTimeFlow = () => {
  const { onboardStore } = useStore();
  const { isOnboarded, currentPosition } = onboardStore;

  const inProgress = currentPosition !== 1 && currentPosition !== 4;

  if (inProgress) {
    return <Redirect to='/welcome/create' />;
  }

  if (!isOnboarded) {
    return <Redirect to='/welcome' />;
  }

  return <Redirect to='/wallet' />;
};
