/**
 * This is a wrapper around the Alpine Typography component that
 * applies the correct typography styles for the extension app.
 *
 * It is interim solution to address the issue of the Alpine Typography
 * component doesn't align with the design system.
 *
 * Once UX team updates the design system, this component should be
 * removed.
 */
declare module '@avalabs/k2-alpine' {
  interface TypographyPropsVariantOverrides {
    title: true;
    titleBold: true;
    details: true;
    caption: true;
    monospace: true;
    monospace10: true;
  }
}

import {
  Typography as K2Typography,
  TypographyProps,
  TypographyPropsVariantOverrides,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

const overrides: Record<
  keyof TypographyPropsVariantOverrides,
  TypographyProps
> = {
  title: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '14px',
  },
  titleBold: {
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '14px',
  },
  details: {
    fontSize: 10,
    fontWeight: 400,
    lineHeight: '14px',
  },
  caption: {
    fontSize: 11,
    fontWeight: 500,
    lineHeight: 'normal',
  },
  monospace: {
    fontFamily: 'DejaVu Sans Mono',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '14px',
  },
  monospace10: {
    fontFamily: 'DejaVu Sans Mono',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '14px',
  },
};

export const Typography: FC<TypographyProps> = ({
  variant = 'title',
  children,
  ...props
}) => (
  <K2Typography
    {...props}
    {...overrides[variant]}
    variant={variant in overrides ? 'body1' : variant}
  >
    {children}
  </K2Typography>
);
