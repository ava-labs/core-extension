import { CircularProgress, Stack, Typography } from '@avalabs/k2-components';
import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';
import { useEffect, useState } from 'react';

const TOKEN_IMAGE_BORDER_RADIUS = '50%';
const TOKEN_IMAGE_DFEAULT_SIZE = '32px';

const getTokenIconInitials = (name: string | undefined) => {
  const names = (name || '').split(' ');
  const firstName = names[0];
  const lastName = names[names.length - 1];
  const initials =
    firstName && lastName
      ? firstName.substring(0, 1) + lastName.substring(0, 1)
      : firstName
      ? firstName.substring(0, 1)
      : '';

  return initials;
};

export function TokenIconK2({
  src,
  children,
  width,
  height,
  name,
  ...rest
}: {
  src?: string;
  children?: any;
  width?: string;
  height?: string;
  name?: string;
  [x: string]: any;
}) {
  const [state, setState] = useState<{ success?: boolean; error?: boolean }>();

  useEffect(() => {
    let isCancelled = false;
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
      img.src = ipfsResolverWithFallback(src);
    })
      .then(() => {
        !isCancelled && setState({ success: true });
      })
      .catch(() => {
        !isCancelled && setState({ error: true });
      });

    return () => {
      isCancelled = true;
    };
  }, [name, src]);

  if (!state) {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          borderRadius: TOKEN_IMAGE_BORDER_RADIUS,
          backgroundColor: 'grey.600',
          width: width || TOKEN_IMAGE_DFEAULT_SIZE,
          height: height || TOKEN_IMAGE_DFEAULT_SIZE,
          flexShrink: 0,
        }}
        {...rest}
      >
        <CircularProgress size={5} />
      </Stack>
    );
  }

  if (state.success) {
    return (
      <Stack
        direction="row"
        sx={{
          borderRadius: TOKEN_IMAGE_BORDER_RADIUS,
          width: width || TOKEN_IMAGE_DFEAULT_SIZE,
          height: height || TOKEN_IMAGE_DFEAULT_SIZE,
          flexShrink: 0,
        }}
        {...rest}
      >
        <img
          src={ipfsResolverWithFallback(src)}
          width={width || TOKEN_IMAGE_DFEAULT_SIZE}
          height={height || TOKEN_IMAGE_DFEAULT_SIZE}
        />
      </Stack>
    );
  }

  if (state.error) {
    const logoText = getTokenIconInitials(name);
    return (
      /** Children here is so that a custom fallback element can be used */
      children ?? (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            borderRadius: TOKEN_IMAGE_BORDER_RADIUS,
            backgroundColor: 'grey.600',
            width: width || TOKEN_IMAGE_DFEAULT_SIZE,
            height: height || TOKEN_IMAGE_DFEAULT_SIZE,
            flexShrink: 0,
          }}
          {...rest}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 'fontWeightSemibolds' }}
          >
            {logoText}
          </Typography>
        </Stack>
      )
    );
  }
}
