import { Stack, StackProps, useTheme } from '@avalabs/k2-alpine';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { ComponentProps } from 'react';

type ScrollbarsProps = Omit<
  ComponentProps<typeof Scrollbars>,
  'children' | 'renderView'
>;

type NoScrollStackProps = StackProps &
  ScrollbarsProps & {
    scrollTrackTopMargin?: number;
  };

export const NoScrollStack = ({
  children,
  sx,
  scrollTrackTopMargin = 0,
  ...scrollbarsProps
}: NoScrollStackProps) => {
  const theme = useTheme();
  return (
    <Scrollbars
      {...scrollbarsProps}
      renderView={(props) => {
        return <Stack {...props} sx={sx} />;
      }}
      autoHide
      renderTrackVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            position: 'absolute',
            width: '6px',
            right: '2px',
            bottom: '2px',
            top: 2 + scrollTrackTopMargin,
            borderRadius: '3px',
          }}
        />
      )}
      renderThumbVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            backgroundColor: theme.palette.text.secondary,
            borderRadius: theme.shape.mediumBorderRadius,
          }}
        />
      )}
    >
      {children}
    </Scrollbars>
  );
};
