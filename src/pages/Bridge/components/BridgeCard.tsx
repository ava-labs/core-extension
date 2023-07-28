import { Card, CardProps, useTheme } from '@avalabs/k2-components';

type BridgeCardProps = CardProps & {
  isWaiting: boolean;
  isDone: boolean;
  isTransferComplete: boolean;
};
export const BridgeCard = ({
  isWaiting,
  isDone,
  isTransferComplete,
  ...props
}: BridgeCardProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: '100%',
        p: 2,
        transition: theme.transitions.create('opacity'),
        backgroundColor: isDone ? 'background.paper' : 'grey.850',
        opacity: !isTransferComplete && (isDone || isWaiting) ? 0.6 : 'unset',
      }}
      {...props}
    />
  );
};
