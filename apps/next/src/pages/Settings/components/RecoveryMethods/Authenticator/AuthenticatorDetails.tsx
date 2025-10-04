import { getIconForMethod } from '../RecoveryMethodCard';
import { CardMenuItem } from '@/pages/Onboarding/components/CardMenu';

export enum AuthenticatorState {
  Initial = 'initial',
  Initiated = 'initiated',
  ConfirmChange = 'confirm-change',
  ConfirmRemoval = 'confirm-removal',
  Pending = 'pending',
  Completing = 'completing',
  VerifyCode = 'verify-code',
  Failure = 'failure',
}

export const AuthenticatorDetails = ({ method, methodName }) => {
  return (
    <CardMenuItem
      icon={getIconForMethod(method)}
      text={methodName}
      key={method.toString()}
    />
  );
};
