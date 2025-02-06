import * as CustomScrollbars from 'react-custom-scrollbars-2';
import type { LegacyRef } from 'react';
import { forwardRef } from 'react';
import { useTheme } from '@avalabs/core-k2-components';

export type ScrollbarsRef = CustomScrollbars.Scrollbars;

// See https://github.com/RobPethick/react-custom-scrollbars-2/blob/master/docs/API.md
// for available props
export const Scrollbars = forwardRef(function Scrollbars(
  props: CustomScrollbars.ScrollbarProps,
  ref: LegacyRef<ScrollbarsRef> | undefined,
) {
  const theme = useTheme();
  const renderThumb = ({ style, ...rest }) => {
    const thumbStyle = {
      backgroundColor: theme.palette.grey[800],
      borderRadius: 9999,
    };
    return <div style={{ ...style, ...thumbStyle }} {...rest} />;
  };

  return (
    <CustomScrollbars.Scrollbars
      renderThumbVertical={renderThumb}
      ref={ref}
      {...props}
    />
  );
});
