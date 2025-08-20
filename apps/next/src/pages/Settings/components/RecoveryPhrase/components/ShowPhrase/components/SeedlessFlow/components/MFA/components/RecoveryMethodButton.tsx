import {
  Button,
  ChevronRightIcon,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

const MethodName = styled(Typography)`
  ${({ theme }) => ({
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightSemiBold,
  })}
`;

const Chevron = () => (
  <ChevronRightIcon
    size={24}
    sx={{ alignSelf: 'center' }}
    className="chevron"
  />
);

interface RecoveryMethodButtonProps {
  methodName: string;
  methodIcon?: React.ReactElement;
  methodDescription?: string;
  onClick: () => void;
}

export const RecoveryMethodButton: FC<RecoveryMethodButtonProps> = ({
  methodName,
  methodDescription,
  methodIcon,
  onClick,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      variant="text"
      color="primary"
      onClick={onClick}
      sx={{
        flexDirection: 'row',
        pl: 2,
        pr: 1.5,
        gap: 2,
        textAlign: 'start',
        alignItems: 'center',
        justifyContent: 'space-between',
        whiteSpace: 'normal',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        p: 2,
        width: 1,

        '& .chevron': {
          transition: theme.transitions.create('transform'),
        },

        '&:hover .chevron': {
          transform: 'translateX(4px)',
        },

        '&.MuiButtonBase-root:hover': {
          backgroundColor: 'grey.850',
        },
      }}
      {...props}
    >
      {methodIcon}
      <Stack sx={{ gap: 1 }}>
        <MethodName>{methodName}</MethodName>
        {methodDescription && (
          <Typography variant="body2" color="text.secondary">
            {methodDescription}
          </Typography>
        )}
      </Stack>
      <Chevron />
    </Button>
  );
};
