import {
  toast,
  ToastCard,
  ExternalLinkIcon,
  Button,
  Link,
} from '@avalabs/k2-components';

export const toastCardWithLink = ({ url, title, label }) => {
  const toaster = toast.custom(
    <ToastCard
      onDismiss={() => toast.remove(toaster)}
      variant="success"
      title={title}
    >
      <Button
        component={Link}
        target="_blank"
        href={url}
        size="large"
        variant="text"
        color="inherit"
        endIcon={<ExternalLinkIcon size={16} />}
        sx={{ pl: 0 }}
      >
        {label}
      </Button>
    </ToastCard>,
    {
      duration: Infinity,
    }
  );
  return { toaster };
};
