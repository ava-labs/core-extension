import { RemoveTotp } from './RemoveTotp';
import { FullscreenModalTitle } from '@/components/FullscreenModal';
import { RecoveryMethodsFullScreenParams } from './RecoveryMethodsFullScreen';
import { AddTotp } from './AddTotp';
import { AddFIDO } from './AddFIDO';
import { DefaultContent } from './DefaultContent';
import { KeyType } from '@core/types';
import { useMemo } from 'react';

export type RecoveryMethodPages =
  | 'defaultContent'
  | 'removeTOTP'
  | 'addTOTP'
  | 'addFIDO';

export type FullScreenContentProps = {
  [page in RecoveryMethodPages]: React.ReactNode;
};

const getFullScreenContent = (
  mfaType?: 'totp' | 'fido',
  action?: 'remove' | 'add',
): RecoveryMethodPages => {
  if (mfaType === 'totp' && action === 'remove') {
    return 'removeTOTP';
  }
  if (mfaType === 'totp' && action === 'add') {
    return 'addTOTP';
  }
  if (mfaType === 'fido' && action === 'add') {
    return 'addFIDO';
  }
  return 'defaultContent';
};

export const FullScreenContent = ({
  mfaType,
  action,
  keyType,
}: RecoveryMethodsFullScreenParams) => {
  const page = getFullScreenContent(mfaType, action);

  const headline = {};
  const content: FullScreenContentProps = useMemo(
    () => ({
      removeTOTP: <RemoveTotp />,
      addTOTP: <AddTotp />,
      addFIDO: keyType ? (
        <AddFIDO keyType={keyType as KeyType} />
      ) : (
        <DefaultContent />
      ),
      defaultContent: <DefaultContent />,
    }),
    [keyType],
  );

  return (
    <>
      {headline[page] && (
        <FullscreenModalTitle>{headline[page]}</FullscreenModalTitle>
      )}
      {content[page]}
    </>
  );
};
