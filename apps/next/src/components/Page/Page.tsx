import { useIsIntersecting } from '@/hooks/useIsIntersecting';
import {
  Stack,
  StackProps,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { PageTopBar } from '../PageTopBar';

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
  descriptionProps?: TypographyProps;
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
  descriptionProps,
  ...htmlProps
}: PageProps) => {
  const { ref, isIntersecting, isObserving } = useIsIntersecting();

  return (
    <Stack
      height="100cqh"
      width={1}
      bgcolor="background.backdrop"
      overflow="auto"
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
      <Stack
        sx={{
          flexGrow: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          px={px ?? 1.5}
          pb={1.5}
          gap={3}
          mt={3}
          flexGrow={1}
          sx={{ minHeight: 0 }}
          {...containerProps}
        >
          {title && (
            <Stack gap={1}>
              <Stack
                direction="row"
                gap={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h2"
                  ref={ref}
                  component="h1"
                  maxWidth="90%"
                >
                  {title}
                </Typography>
                {titleAction}
              </Stack>
              {description && (
                <Typography
                  variant="caption"
                  maxWidth="60%"
                  {...descriptionProps}
                >
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
            sx={{ minHeight: 0 }}
            {...contentProps}
          >
            {children}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
