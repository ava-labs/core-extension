import { HorizontalFlex, LoadingIcon } from '@avalabs/react-components';
import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import React from 'react';

const TOKEN_IMAGE_BORDER_RADIUS = '50%';
const TOKEN_IMAGE_DFEAULT_SIZE = '32px';

export function TokenIcon({
  src,
  children,
  width,
  height,
}: {
  src?: string;
  children?: any;
  width?: string;
  height?: string;
}) {
  const theme = useTheme();
  const [state, setState] = useState<{ success?: boolean; error?: boolean }>();

  useEffect(() => {
    new Promise((resolve, reject) => {
      if (!src) {
        reject('no source value');
        return;
      }

      const img = document.createElement('img');
      img.onerror = (err) => {
        reject(err);
      };
      img.onload = () => {
        resolve(img);
      };
      img.src = src;
    })
      .then(() => {
        setState({ success: true });
      })
      .catch(() => {
        setState({ error: true });
      });
  }, []);

  if (!state) {
    return (
      <HorizontalFlex
        justify={'center'}
        align={'center'}
        radius={TOKEN_IMAGE_BORDER_RADIUS}
        background={`${theme.colors.disabled}CC`}
        width={width || TOKEN_IMAGE_DFEAULT_SIZE}
        height={height || TOKEN_IMAGE_DFEAULT_SIZE}
      >
        <LoadingIcon height={'5px'} />
      </HorizontalFlex>
    );
  }

  if (state.success) {
    return (
      <HorizontalFlex
        as="img"
        src={src}
        width={width || TOKEN_IMAGE_DFEAULT_SIZE}
        height={height || TOKEN_IMAGE_DFEAULT_SIZE}
        radius={TOKEN_IMAGE_BORDER_RADIUS}
      />
    );
  }

  if (state.error) {
    return (
      /** Children here is so that a custom fallback element can be used */
      children ?? (
        <HorizontalFlex
          radius={TOKEN_IMAGE_BORDER_RADIUS}
          background={`${theme.colors.disabled}CC`}
          width={width || TOKEN_IMAGE_DFEAULT_SIZE}
          height={height || TOKEN_IMAGE_DFEAULT_SIZE}
        />
      )
    );
  }
}
