import { MethodIcons } from './recoveryMethodCards.config';
import { RecoveryMethod } from '@core/types';
import { MethodCard } from './components/MethodCard';

interface RecoveryMethodCardProps {
  method: RecoveryMethod;
  onClick: () => void;
  methodName?: string;
}

export const getIconForMethod = (method: RecoveryMethod) => {
  if (method.type === 'totp') {
    return MethodIcons.authenticator;
  }
  if (method.aaguid === '00000000-0000-0000-0000-000000000000') {
    return MethodIcons.yubikey;
  }
  return MethodIcons.passkey;
};

export const RecoveryMethodCard = ({
  method,
  onClick,
  methodName,
}: RecoveryMethodCardProps) => {
  return (
    <MethodCard
      icon={getIconForMethod(method)}
      title={methodName || method.type}
      onClick={onClick}
    />
  );
};
