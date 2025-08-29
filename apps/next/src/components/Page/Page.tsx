import { Stack, StackProps, styled, Typography } from '@avalabs/k2-alpine';
import { useIsIntersecting } from './hooks';
import { PageTopBar } from '../PageTopBar';

type PageProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  withBackButton?: boolean;
  onBackClicked?: () => void;
  contentProps?: StackProps;
};

// TODO: remove this once we have a proper scrollable component
const NoScrollStack = styled(Stack)`
  overflow: auto;
  flex-grow: 1;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Page = ({
  title,
  description,
  children,
  contentProps,
  onBackClicked,
  ...htmlProps
}: PageProps) => {
  const { ref, isIntersecting, isObserving } = useIsIntersecting();

  return (
    <Stack
      height="100cqh"
      width={1}
      bgcolor="background.backdrop"
      overflow="hidden"
      {...htmlProps}
    >
      <PageTopBar
        showBack
        isObserving={isObserving}
        isIntersecting={isIntersecting}
        title={title}
        onBackClicked={onBackClicked}
      />
      <NoScrollStack>
        <Stack px={1.5} pb={1.5} gap={3} flexGrow={1}>
          {title && (
            <Stack gap={1}>
              <Typography variant="h2" ref={ref} component="h1">
                {title}
              </Typography>
              {description && (
                <Typography variant="caption" sx={{ width: '60%' }}>
                  {description}
                </Typography>
              )}
            </Stack>
          )}
          <Stack
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            gap={1.5}
            {...contentProps}
          >
            {children}
          </Stack>
        </Stack>
      </NoScrollStack>
    </Stack>
  );
};
