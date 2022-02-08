import { Typography, VerticalFlex } from '@avalabs/react-components';

export function NoTransactions() {
  return (
    <VerticalFlex align="center" grow="1" margin="48px 0 0 0">
      <Typography size={18} height="22px" weight={600}>
        No recent activity
      </Typography>
      <Typography size={14} height="17px" margin="8px 0">
        New transactions will show here
      </Typography>
    </VerticalFlex>
  );
}
