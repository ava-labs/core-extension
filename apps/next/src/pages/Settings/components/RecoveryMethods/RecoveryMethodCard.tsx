import { RecoveryMethod } from '@core/types';
import { MethodCard } from './components/MethodCard';
import { getIconForMethod } from './utils';

interface RecoveryMethodCardProps {
  method: RecoveryMethod;
  onClick: () => void;
  methodName?: string;
}

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
