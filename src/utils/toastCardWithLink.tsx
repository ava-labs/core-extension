import {
  toast,
  ToastCard,
  ExternalLinkIcon,
  Button,
  Link,
} from '@avalabs/k2-components';

export const toastCardWithLink = ({ url, title, label, id = '' }) => {
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
        size="xlarge"
        variant="text"
        color="inherit"
        endIcon={<ExternalLinkIcon size={16} />}
        sx={{ p: 0 }}
      >
        {label}
      </Button>
    </ToastCard>,
    {
      id: id,
      duration: Infinity,
    }
  );
  return { toaster };
};
