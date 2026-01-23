import { Stack, StackProps, useTheme } from '@avalabs/k2-alpine';
import { ScrollbarProps, Scrollbars } from 'react-custom-scrollbars-2';

type ScrollbarsProps = Omit<ScrollbarProps, 'renderView'>;

type NoScrollStackProps = ScrollbarsProps & {
  scrollTrackTopMargin?: number;
  stackProps?: StackProps;
};

export const NoScrollStack = ({
  children,
  stackProps,
  scrollTrackTopMargin = 0,
  ...scrollbarsProps
}: NoScrollStackProps) => {
  const theme = useTheme();
  return (
    <Scrollbars
      {...scrollbarsProps}
      renderView={(props) => {
        return <Stack {...stackProps} {...props} />;
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
