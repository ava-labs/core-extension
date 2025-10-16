import {
  FullscreenModal,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { Page } from '@/components/Page';
import { StackProps } from '@avalabs/k2-alpine';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  fullscreen: boolean;
  title?: string;
  description?: string;
}>;

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

export const OmniViewPage: FC<Props> = ({
  children,
  fullscreen,
  title,
  description,
}) => {
  if (fullscreen) {
    return (
      <FullscreenModal open withCoreLogo withAppInfo>
        <FullscreenModalTitle>{title}</FullscreenModalTitle>
        {description && (
          <FullscreenModalDescription>{description}</FullscreenModalDescription>
        )}
        <FullscreenModalContent pb={4}>{children}</FullscreenModalContent>
      </FullscreenModal>
    );
  }
  return (
    <Page
      title={title}
      description={description}
      contentProps={contentProps}
      withBackButton={false}
    >
      {children}
    </Page>
  );
};
