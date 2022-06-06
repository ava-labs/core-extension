import {
  LoadingSpinnerIcon,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';

export function NoTransactions({ loading = false }: { loading: boolean }) {
  const theme = useTheme();
  return (
    <VerticalFlex align="center" grow="1" margin="48px 0 0 0">
      {loading ? (
        <LoadingSpinnerIcon height="32px" color={theme.colors.icon1} />
      ) : (
        <>
          <Typography size={18} height="22px" weight={600}>
            No recent activity
          </Typography>
          <Typography size={14} height="17px" margin="8px 0">
            New transactions will show here.
          </Typography>
        </>
      )}
    </VerticalFlex>
  );
}
