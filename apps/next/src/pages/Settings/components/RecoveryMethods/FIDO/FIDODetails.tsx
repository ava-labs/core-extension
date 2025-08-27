import { CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import { getIconForMethod } from '../RecoveryMethodCard';

export const FIDODetails = ({ method }) => {
  return (
    <CardMenuItem
      onClick={() => {}}
      icon={getIconForMethod(method)}
      text={method.name}
      key={method.toString()}
    />
  );
};
