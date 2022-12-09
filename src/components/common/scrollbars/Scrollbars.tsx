import * as CustomScrollbars from 'react-custom-scrollbars-2';
import { forwardRef, LegacyRef } from 'react';
import { useTheme } from 'styled-components';

export type ScrollbarsRef = CustomScrollbars.Scrollbars;

// See https://github.com/RobPethick/react-custom-scrollbars-2/blob/master/docs/API.md
// for available props
export const Scrollbars = forwardRef(function Scrollbars(
  props: CustomScrollbars.ScrollbarProps,
  ref: LegacyRef<ScrollbarsRef> | undefined
) {
  const theme = useTheme();
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: theme.colors.stroke1,
      borderRadius: 9999,
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  return (
    <CustomScrollbars.Scrollbars
      renderThumbVertical={renderThumb}
      ref={ref}
      {...props}
    />
  );
});
