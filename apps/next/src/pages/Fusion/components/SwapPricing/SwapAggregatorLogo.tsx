import { FC } from 'react';

import { FaQuestionCircle } from 'react-icons/fa';

type AggregatorLogoProps = {
  logoUrl?: string;
  name: string;
};

export const SwapAggregatorLogo: FC<AggregatorLogoProps> = ({
  logoUrl,
  name,
}) =>
  logoUrl ? (
    <img src={logoUrl} width={32} height={32} alt={name} />
  ) : (
    <FaQuestionCircle size={16} color="text.primary" opacity={0.3} />
  );
