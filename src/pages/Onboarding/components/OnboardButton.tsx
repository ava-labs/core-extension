import { Stack, Typography, useTheme } from '@avalabs/k2-components';

export function OnboardButton({
  children,
  className,
  margin,
  onClick,
  title,
  testId,
  variant = 'regular',
}: {
  children: any;
  className?: string;
  margin?: string;
  onClick?: () => void;
  title: string;
  testId?: string;
  variant?: 'regular' | 'small';
}) {
  const theme = useTheme();

  if (variant === 'small') {
    return (
      <Stack
        data-testid={`${testId}-button`}
        onClick={onClick}
        sx={(theme) => ({
          m: margin,
          borderRadius: theme.spacing(1),
          border: '1px solid transparent',
          '&:hover': {
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.grey[850],
            cursor: 'pointer',
          },
        })}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            width: theme.spacing(29),
            height: theme.spacing(7),
            pl: 2,
            alignItems: 'center',
            justifyContent: 'flex-start',
            columnGap: 3,
          }}
          className={className}
        >
          {children}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'semibold',
              textAlign: 'center',
            }}
          >
            {title}
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      data-testid={`${testId}-button`}
      onClick={onClick}
      sx={{
        m: margin,
        borderRadius: theme.spacing(1),
        border: '1px solid transparent',
        '&:hover': {
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.grey[850],
          cursor: 'pointer',
        },
      }}
    >
      <Stack
        sx={{
          width: theme.spacing(29),
          height: theme.spacing(25),
          alignItems: 'center',
          justifyContent: 'center',
          rowGap: 3,
        }}
        className={className}
      >
        <Typography
          variant="body1"
          sx={{
            height: theme.spacing(3),
            fontWeight: 'semibold',
          }}
        >
          {title}
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
}
