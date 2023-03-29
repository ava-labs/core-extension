import {
  toast,
  ToastCard,
  Typography,
  ExternalLinkIcon,
  Button,
} from '@avalabs/k2-components';

export const toastCardWithLink = ({ url, title, label }) => {
  const toaster = toast.custom(
    <ToastCard
      onDismiss={() => toast.remove(toaster)}
      variant="success"
      title={title}
      sx={{ width: '343px', minWidth: '343px', position: 'relative' }}
    >
      <Button
        target="_blank"
        href={url}
        variant="text"
        sx={{
          p: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          {label}
        </Typography>
        <ExternalLinkIcon
          size={16}
          sx={{ ml: 1, color: (theme) => theme.palette.text.primary }}
        />
      </Button>
    </ToastCard>,
    {
      duration: Infinity,
    }
  );
  return { toaster };
};
