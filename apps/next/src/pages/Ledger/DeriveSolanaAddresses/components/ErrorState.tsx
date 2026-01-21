import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { Button, Stack } from '@avalabs/k2-alpine';
import { FC, ReactNode } from 'react';

type Props = {
  title: string;
  description?: ReactNode;
  content: ReactNode;
  action?: () => void;
  actionLabel?: string;
};

export const ErrorState: FC<Props> = ({
  title,
  description,
  content,
  action,
  actionLabel,
}) => {
  return (
    <Stack width="100%" height="100%" gap={2}>
      <FullscreenModalTitle>{title}</FullscreenModalTitle>
      {description && (
        <FullscreenModalDescription>{description}</FullscreenModalDescription>
      )}
      <FullscreenModalContent px={5} alignItems="center" textAlign="center">
        {content}
      </FullscreenModalContent>
      {action && (
        <FullscreenModalActions>
          <Stack width="100%" alignItems="center" justifyContent="center">
            <Button variant="contained" color="primary" onClick={action}>
              {actionLabel}
            </Button>
          </Stack>
        </FullscreenModalActions>
      )}
    </Stack>
  );
};
