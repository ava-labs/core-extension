import { useIsIntersecting } from '@/hooks/useIsIntersecting';
import { Stack, StackProps, Typography } from '@avalabs/k2-alpine';
import { PageTopBar } from '../PageTopBar';
import { NoScrollStack } from '../NoScrollStack';

type PageProps = {
  title?: string;
  titleAction?: React.ReactElement;
  description?: string;
  children: React.ReactNode;
  withBackButton?: boolean;
  onBack?: () => void;
  contentProps?: StackProps;
  containerProps?: StackProps;
  withViewSwitcher?: boolean;
  px?: number;
};

export const Page = ({
  title,
  description,
  titleAction,
  children,
  contentProps,
  onBack,
  withBackButton = true,
  withViewSwitcher = true,
  containerProps,
  px,
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
        <Stack px={px ?? 1.5} pb={1.5} gap={3} flexGrow={1} {...containerProps}>
          {title && (
            <Stack gap={1}>
              <Stack direction="row" gap={1} justifyContent="space-between">
                <Typography variant="h2" ref={ref} component="h1">
                  {title}
                </Typography>
                {titleAction}
              </Stack>
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
