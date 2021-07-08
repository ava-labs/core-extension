import React from 'react';
import { observer } from 'mobx-react-lite';
import { MoonIcon, SunshineIcon, TextButton } from '@avalabs/react-components';
import { useStore } from '@src/store/store';

export const ToggleDarkMode = observer(() => {
  const { themeStore } = useStore();

  return (
    <TextButton
      onClick={() => {
        themeStore.toggleDarkMode();
      }}
    >
      {themeStore.isDarkMode ? <MoonIcon /> : <SunshineIcon />}
    </TextButton>
  );
});
