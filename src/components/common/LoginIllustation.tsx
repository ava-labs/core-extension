import React from 'react';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { ThemeVariant } from '@src/background/services/settings/models';

interface LoginIllustrationProps {
  variant?: 'primary' | 'secondary';
  size?: number;
}

export function LoginIllustration({
  size = 240,
  variant = 'primary',
}: LoginIllustrationProps) {
  const { theme } = useSettingsContext();

  let videoSource = '';
  if (variant === 'secondary') {
    videoSource =
      theme === ThemeVariant.LIGHT
        ? 'images/login-illustration-light.mp4'
        : 'images/login-illustration-dark2.mp4';
  } else {
    videoSource =
      theme === ThemeVariant.LIGHT
        ? 'images/login-illustration-light.mp4'
        : 'images/login-illustration-dark.mp4';
  }

  return (
    <video width={size} height={size} autoPlay>
      <source src={videoSource} type="video/mp4" />
    </video>
  );
}
