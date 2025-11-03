import { MethodCard } from '../components/MethodCard';
import { getIconForMethod } from '../RecoveryMethodCard';
export const AuthenticatorDetails = ({ method, methodName }) => {
  return (
    <MethodCard
      icon={getIconForMethod(method)}
      title={methodName}
      key={method.toString()}
      showChevron={false}
    />
  );
};
