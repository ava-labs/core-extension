import { RemoveTotp } from './RemoveTotp';
import { FullscreenModalTitle } from '@/components/FullscreenModal';
import { RecoveryMethodsFullScreenParams } from './RecoveryMethodsFullScreen';
import { AddTotp } from './AddTotp';
import { AddFIDO } from './AddFIDO';
import { DefaultContent } from './DefaultContent';
import { KeyType } from '@core/types';

export type RecoveryMethodPages =
  | 'defaultContent'
  | 'removeTOTP'
  | 'addTOTP'
  | 'addFIDO';

export type FullScreenContentProps = {
  [page in RecoveryMethodPages]: React.ReactNode;
};

export const FullScreenContent = ({
  mfaType,
  action,
  keyType,
}: RecoveryMethodsFullScreenParams) => {
  const getPage = () => {
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

  const page = getPage();

  const headline = {};
  const content: FullScreenContentProps = {
    removeTOTP: <RemoveTotp />,
    addTOTP: <AddTotp />,
    addFIDO: keyType ? (
      <AddFIDO keyType={keyType as KeyType} />
    ) : (
      <DefaultContent />
    ),
    defaultContent: <DefaultContent />,
  };

  return (
    <>
      {headline[page] && (
        <FullscreenModalTitle>{headline[page]}</FullscreenModalTitle>
      )}
      {content[page]}
    </>
  );
};
