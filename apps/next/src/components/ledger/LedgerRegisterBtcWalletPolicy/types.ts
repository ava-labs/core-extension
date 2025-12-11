type PublicKeyStatus = `pubkey:${GenericStatus}`;
type PolicyStatus = `policy:${GenericStatus | IncorrectDeviceStatus}`;

type IncorrectDeviceStatus = `incorrect-device`;
type GenericStatus = 'pending' | 'success' | 'error';

export type PhaseStatus = GenericStatus | IncorrectDeviceStatus;

export type Status = 'idle' | 'dismissed' | PublicKeyStatus | PolicyStatus;

export type PolicyRegistrationState = {
  policyName?: string;
  policyDerivationPath?: string;
  status: Status;
  dismiss: () => void;
  xpub?: string;
  retry: () => Promise<void>;
};
