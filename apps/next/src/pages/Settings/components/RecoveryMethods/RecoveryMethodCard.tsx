import { CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import { MethodIcons } from './RecoveryMethodList';
import { RecoveryMethod } from '@core/types';

interface RecoveryMethodCardProps {
  method: RecoveryMethod;
  onClick: () => void;
  methodName?: string;
}

export const getIconForMethod = (method) => {
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
    <CardMenuItem
      onClick={onClick}
      icon={getIconForMethod(method)}
      text={methodName || method.type}
      key={method.toString()}
      size="small"
    />
  );
};
