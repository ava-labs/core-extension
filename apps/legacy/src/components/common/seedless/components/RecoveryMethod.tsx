import {
  Button,
  ButtonProps,
  ChevronRightIcon,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@avalabs/core-k2-components';

const MethodName = styled(Typography)`
  ${({ theme }) => ({
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightSemibold,
  })}
`;

const Chevron = () => (
  <ChevronRightIcon
    size={24}
    sx={{ alignSelf: 'center' }}
    className="chevron"
  />
);

export const RecoveryMethod = ({
  sx,
  methodName,
  methodDescription,
  methodIcon,
  asCard = false,
  ...props
}: ButtonProps & {
  methodName: string;
  methodIcon?: React.ReactElement;
  methodDescription?: string;
  asCard?: boolean;
}) => {
  const theme = useTheme();

  return (
    <Button
      variant="text"
      color="primary"
      sx={[
        {
          flexDirection: 'row',
          pl: 2,
          pr: 1.5,
          gap: 2,
          textAlign: 'start',
          alignItems: 'center',
          justifyContent: 'space-between',
          whiteSpace: 'normal',

          '& .chevron': {
            transition: theme.transitions.create('transform'),
          },

          '&:hover .chevron': {
            transform: 'translateX(4px)',
          },
        },
        asCard
          ? {
              backgroundColor: 'background.paper',
              borderRadius: 1,
              p: 2,

              '&.MuiButtonBase-root:hover': {
                backgroundColor: 'grey.850',
              },
            }
          : null,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
