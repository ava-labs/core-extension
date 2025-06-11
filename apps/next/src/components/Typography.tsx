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
import {
  Typography as K2Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

type Variant = 'title' | 'titleBold' | 'details' | 'monospace' | 'caption';

type Props = Omit<TypographyProps, 'variant'> & {
  variant: Variant;
};

const overrides: Record<Variant, TypographyProps> = {
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
};

export const Typography: FC<Props> = ({ variant, children, ...props }) => {
  return (
    <K2Typography {...props} {...overrides[variant]}>
      {children}
    </K2Typography>
  );
};
