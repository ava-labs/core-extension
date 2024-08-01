import { styled, Typography } from '@avalabs/core-k2-components';

export const StyledNumberList = styled(Typography)`
  ${({ theme }) => ({
    ...theme.typography.body1,
    display: 'block',
    backgroundColor: theme.palette.background.paper,
    lineHeight: theme.spacing(3),
    height: theme.spacing(3),
    width: theme.spacing(3),
    borderRadius: '50%',
    textAlign: 'center',
    marginRight: theme.spacing(2),
    flexShrink: 0,
  })}
`;
