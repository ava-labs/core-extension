import { FC, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { Box, BoxProps, styled } from '@avalabs/k2-alpine';

type LogoAreaProps = {
  size: number;
  logoUri?: string;
};
type TokenLogoProps = BoxProps & LogoAreaProps;

export const TokenLogo: FC<TokenLogoProps> = ({ logoUri, size, ...props }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <LogoArea size={size} {...props}>
      {!hasError && logoUri ? (
        <Logo
          src={logoUri}
          onError={() => setHasError(true)}
          alt="" // If it fails, we display a fallback icon
          size={size}
        />
      ) : (
        <FaQuestionCircle size={size / 2} color="text.primary" opacity={0.3} />
      )}
    </LogoArea>
  );
};

const LogoArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<Pick<LogoAreaProps, 'size'>>(({ size }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: size,
  height: size,
}));

const Logo = styled('img', {
  shouldForwardProp: (prop) => prop !== 'size',
})<Pick<LogoAreaProps, 'size'>>(({ size }) => ({
  width: size,
  height: size,
  borderRadius: '50%',
}));
