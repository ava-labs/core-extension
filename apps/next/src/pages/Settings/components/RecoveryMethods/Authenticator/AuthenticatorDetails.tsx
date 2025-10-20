import { getIconForMethod } from '../RecoveryMethodCard';
import { CardMenuItem } from '@/pages/Onboarding/components/CardMenu';

export const AuthenticatorDetails = ({ method, methodName }) => {
  return (
    <CardMenuItem
      icon={getIconForMethod(method)}
      text={methodName}
      key={method.toString()}
    />
  );
};
