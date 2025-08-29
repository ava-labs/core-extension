import { Stack, StackProps, styled, Typography } from '@avalabs/k2-alpine';
import { useIsIntersecting } from '@/hooks/useIsIntersecting';
import { PageTopBar } from '../PageTopBar';

type PageProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  withBackButton?: boolean;
  onBack?: () => void;
  contentProps?: StackProps;
  containerProps?: StackProps;
  withViewSwitcher?: boolean;
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
  onBack,
  withBackButton = true,
  withViewSwitcher = true,
  containerProps,
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
        showBack={withBackButton}
        showViewSwitcher={withViewSwitcher}
        onBackClicked={onBack}
        isObserving={isObserving}
        isIntersecting={isIntersecting}
        title={title}
      />
      <NoScrollStack>
        <Stack px={1.5} pb={1.5} gap={3} flexGrow={1} {...containerProps}>
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
