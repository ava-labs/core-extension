import { FC } from 'react';
import { ServiceType } from '@avalabs/fusion-sdk';
import { FaQuestionCircle } from 'react-icons/fa';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';

import { SwapAggregatorLogoArea } from './SwapAggregatorLogoArea';

type AggregatorLogoProps = {
  logoUrl?: string;
  name: string;
  service: ServiceType;
};

const SERVICE_LOGOS: Partial<Record<ServiceType, React.FC>> = {
  [ServiceType.WRAP_UNWRAP]: FaArrowRightArrowLeft,
};

export const SwapAggregatorLogo: FC<AggregatorLogoProps> = ({
  logoUrl,
  name,
  service,
}) => {
  if (logoUrl) {
    return <img src={logoUrl} width={32} height={32} alt={name} />;
  }

  const ServiceLogo = SERVICE_LOGOS[service] ?? FaQuestionCircle;

  return (
    <SwapAggregatorLogoArea size={32}>
      <ServiceLogo size={16} color="text.primary" />
    </SwapAggregatorLogoArea>
  );
};
