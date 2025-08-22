import { AuthErrorCode, MfaRequestData, MfaRequestType } from '@core/types';
import { useSeedlessMnemonicExport } from '@core/ui';

export type StageProps = ReturnType<typeof useSeedlessMnemonicExport> & {
  fullscreen: boolean;
};

export type ChallengeComponentProps<MRT extends MfaRequestType> = {
  challenge: Extract<MfaRequestData, { type: MRT }>;
  error?: AuthErrorCode;
  onError: (error: AuthErrorCode | undefined) => void;
  name?: string;
};
