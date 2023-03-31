import { PropsWithChildren } from 'react';
import {
  Typography,
  Stack,
  Divider,
  styled,
  useTheme,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

interface ConnectionIndicatorProps {
  connected: boolean;
  disableTooltip?: boolean;
  size?: number;
  className?: string;
}

/**
 * Used for positioning the tooltip content so that the conainer overlaps with the indicator dot.
 * This prevents the Conent from disappearing when the mouse is moved over it.
 */
const ContentContainer = styled(Stack)`
  position: absolute;
  display: none;
  left: -57px;
  z-index: 1;
  top: 0;
`;

const Content = styled(Stack)`
  position: relative;
  border-radius: 10px;
  background: ${({ theme }) => `${theme.palette.grey[900]}D9`};
  box-sizing: border-box;
  box-shadow: 0px 10px 25px ${({ theme }) => `${theme.palette.grey[900]}1A`};
  backdrop-filter: blur(25px);
  margin-top: 19px;
  padding: 8px 0;
  min-width: 240px;
`;

const ArrowSVG = styled('svg')({
  position: 'absolute',
  bottom: '100%',
  marginBottom: '-1px',
  left: '56px',
});

const IndicatorDot = styled('div', {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'connected',
  name: 'IndicatorDot',
  slot: 'Root',
})<{ size: number; connected: boolean }>(({ theme, size, connected }) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  position: 'relative',
  background: connected ? theme.palette.success.main : theme.palette.error.main,

  '&:hover': {
    '> .content_container': {
      display: 'flex',
    },
  },
}));

const Separator = styled(Divider)`
  background: ${({ theme }) => theme.palette.grey[800]};
  margin: 8px 0;
`;

export function ConnectionIndicatorK2({
  children,
  connected,
  disableTooltip,
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
      {!disableTooltip && (
        <ContentContainer className="content_container">
          <Content>
            <Typography
              weight={600}
              size={12}
              height="16px"
              color={statusColor}
              margin="0 16px"
            >
              {connected ? t('Connected') : t('Not Connected')}
            </Typography>
            {children && (
              <>
                <Separator />
                {children}
              </>
            )}
            <ArrowSVG
              viewBox="180.861 57.728 13.662 5.192"
              width="13.662"
              height="5.192"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 88.831 21.526 L 75.169 21.526 C 75.834 21.526 76.472 21.261 76.941 20.79 L 80.937 16.776 C 81.523 16.187 82.477 16.187 83.063 16.776 L 87.059 20.79 C 87.529 21.261 88.166 21.526 88.831 21.526 Z"
                fill={`${theme.palette.grey[900]}D9`}
                shapeRendering="crispEdges"
                transform="matrix(1, 0, 0, 1, 105.69223, 41.39344)"
              ></path>
            </ArrowSVG>
          </Content>
        </ContentContainer>
      )}
    </IndicatorDot>
  );
}
