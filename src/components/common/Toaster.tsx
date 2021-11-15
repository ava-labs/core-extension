import { useTheme } from 'styled-components';
import React from 'react';
import { Toaster as ReactHotToaster } from 'react-hot-toast';

export function Toaster() {
  const theme = useTheme();

  return (
    <ReactHotToaster
      toastOptions={{
        className: '',
        style: {
          background: theme.colors.text1,
          padding: '12px 24px',
          color: '#713200',
          borderRadius: '24px',
          height: '48px',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: theme.fontFamily,
          minWidth: '160px',
          boxShadow: '0px 5px 10px 0px #00000040',
        },
        success: {
          icon: null,
          style: {
            color: theme.colors.success,
          },
        },
        error: {
          icon: null,
          style: {
            color: theme.colors.error,
          },
        },
      }}
    />
  );
}
