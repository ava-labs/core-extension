import { Stack, StackProps, useTheme } from '@avalabs/k2-alpine';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { ComponentProps } from 'react';

type ScrollbarsProps = Omit<
  ComponentProps<typeof Scrollbars>,
  'children' | 'renderView'
>;

type NoScrollStackProps = StackProps &
  ScrollbarsProps & {
    children: React.ReactNode;
  };

export const NoScrollStack = ({
  children,
  sx,
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
      renderThumbVertical={() => (
        <div
          style={{
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
