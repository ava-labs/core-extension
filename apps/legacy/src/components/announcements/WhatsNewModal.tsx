import {
  SolanaNowSupported,
  useSolanaSupportModal,
} from './SolanaNowSupported';

export const WhatsNewModal = () => {
  const { handleProceed, handleSkip, isOpen } = useSolanaSupportModal();

  return (
    <SolanaNowSupported
      onProceed={handleProceed}
      onSkip={handleSkip}
      open={isOpen}
    />
  );
};
