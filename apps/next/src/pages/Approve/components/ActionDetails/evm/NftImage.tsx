import { styled, Stack, useTheme, Box } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

type NftImageProps = {
  logoUri?: string;
};

const Image = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 8,
});

const FallbackIconContainer = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
});

export const NftImage: FC<NftImageProps> = ({ logoUri }) => {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);
  return (
    <Stack
      overflow="hidden"
      width={80}
      height={80}
      borderRadius={theme.shape.mediumBorderRadius}
    >
      {!hasError && logoUri ? (
        <Image src={logoUri} onError={() => setHasError(true)} alt="" />
      ) : (
        <FallbackIconContainer>
          <FaQuestionCircle size={40} color="text.primary" opacity={0.3} />
        </FallbackIconContainer>
      )}
    </Stack>
  );
};
