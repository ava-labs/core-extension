import { PropsWithChildren } from 'react';
import {
  Typography,
  Stack,
  Divider,
  useTheme,
  StackProps,
  Box,
  BoxProps,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

interface ConnectionIndicatorProps {
  connected: boolean;
  size?: number;
  className?: string;
}

/**
 * Used for positioning the tooltip content so that the conainer overlaps with the indicator dot.
 * This prevents the Conent from disappearing when the mouse is moved over it.
 */
const ContentContainer = (props: StackProps) => (
  <Stack
    sx={{
      position: 'absolute',
      display: 'none',
      minWidth: 260,
      maxWidth: 320,
      transform: 'translate(-25%)',
      zIndex: 1,
      top: 0,
    }}
    {...props}
  />
);

const Content = (props: StackProps) => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        position: 'relative',
        borderRadius: 1,
        background: theme.palette.grey[850],
        boxShadow: 10,
        backdropFilter: 'blur(25px)',
        mt: 2.5,
        py: 1,
        px: 2,
        minWidth: '260px',
        gap: 0.5,
      }}
      {...props}
    />
  );
};

type IndicatorDotProps = BoxProps & {
  size: number;
  connected: boolean;
};

const IndicatorDot = ({ size, connected, ...rest }: IndicatorDotProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: theme.shape.borderRadius,
        position: 'relative',
        background: connected
          ? theme.palette.success.main
          : theme.palette.error.main,

        ':hover .content_container': {
          display: 'flex',
        },
      }}
      {...rest}
    />
  );
};

export function ConnectionIndicatorK2({
  children,
  connected,
  size = 12,
  className,
}: PropsWithChildren<ConnectionIndicatorProps>) {
  const { t } = useTranslation();
  const theme = useTheme();
  const statusColor = connected
    ? theme.palette.success.main
    : theme.palette.error.main;

  return (
    <IndicatorDot size={size} connected={connected} className={className}>
      {children && (
        <ContentContainer className="content_container">
          <Content>
            <Stack sx={{ gap: 0.75 }} divider={<Divider sx={{ mx: -2 }} />}>
              <Typography variant="subtitle2" color={statusColor}>
                {connected ? t('Connected') : t('Not Connected')}
              </Typography>

              {children}
            </Stack>
            <svg
              viewBox="180.861 57.728 13.662 5.192"
              width="13.662"
              height="5.192"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                bottom: '100%',
                marginBottom: '-1px',
                left: '25%',
              }}
            >
              <path
                d="M 88.831 21.526 L 75.169 21.526 C 75.834 21.526 76.472 21.261 76.941 20.79 L 80.937 16.776 C 81.523 16.187 82.477 16.187 83.063 16.776 L 87.059 20.79 C 87.529 21.261 88.166 21.526 88.831 21.526 Z"
                fill={`${theme.palette.grey[850]}`}
                shapeRendering="crispEdges"
                transform="matrix(1, 0, 0, 1, 105.69223, 41.39344)"
              ></path>
            </svg>
          </Content>
        </ContentContainer>
      )}
    </IndicatorDot>
  );
}
