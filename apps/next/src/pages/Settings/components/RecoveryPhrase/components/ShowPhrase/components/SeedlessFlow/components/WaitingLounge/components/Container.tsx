import {
  FullscreenModal,
  FullscreenModalContent,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { Page } from '@/components/Page';
import { StackProps } from '@avalabs/k2-alpine';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ fullscreen: boolean; title: string }>;

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

export const Container: FC<Props> = ({ children, fullscreen, title }) => {
  if (fullscreen) {
    return (
      <FullscreenModal open withCoreLogo withAppInfo>
        <FullscreenModalTitle>{title}</FullscreenModalTitle>
        <FullscreenModalContent pb={4}>{children}</FullscreenModalContent>
      </FullscreenModal>
    );
  }
  return (
    <Page title={title} contentProps={contentProps}>
      {children}
    </Page>
  );
};
