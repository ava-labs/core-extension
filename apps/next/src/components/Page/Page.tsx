import { MdArrowBack } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import {
  Fade,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';

import { useIsIntersecting } from './hooks';

type PageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  withBackButton?: boolean;
};

// TODO: remove this once we have a proper scrollable component
const NoScrollStack = styled(Stack)`
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Page = ({ title, description, children }: PageProps) => {
  const theme = useTheme();
  const history = useHistory();
  const { ref, isIntersecting } = useIsIntersecting();

  return (
    <Stack
      height="100cqh"
      width={1}
      bgcolor="background.backdrop"
      overflow="hidden"
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        px={1}
        py={1.5}
        borderBottom={
          isIntersecting ? 'none' : `1px solid ${theme.palette.divider}`
        }
      >
        <Stack direction="row" gap={1} alignItems="center">
          <IconButton size="small" onClick={history.goBack}>
            <MdArrowBack size={24} />
          </IconButton>
          <Fade in={!isIntersecting}>
            <Typography variant="h6">{title}</Typography>
          </Fade>
        </Stack>
      </Stack>
      <NoScrollStack>
        <Stack px={1.5} pb={1.5} gap={3}>
          <Stack gap={1}>
            <Typography variant="h2" ref={ref}>
              {title}
            </Typography>
            {description && (
              <Typography variant="caption">{description}</Typography>
            )}
          </Stack>
          <Stack
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            gap={1.5}
          >
            {children}
          </Stack>
        </Stack>
      </NoScrollStack>
    </Stack>
  );
};
