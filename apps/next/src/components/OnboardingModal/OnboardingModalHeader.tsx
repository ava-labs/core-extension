import { FiArrowLeft } from 'react-icons/fi';
import { IconButton, Stack, StackProps, styled } from '@avalabs/k2-alpine';

import { PageControl } from '../PageControl';

import { useModalPageControl } from './OnboardingModalPageControlProvider';

const StyledHeader = styled(Stack)`
  padding-top: ${({ theme }) => theme.spacing(4)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  height: 56px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: relative;
`;

type OnboardingModalHeaderProps = StackProps & {
  onBack?: () => void;
};

export const OnboardingModalHeader = ({
  onBack,
  ...props
}: OnboardingModalHeaderProps) => {
  const { total, current, isBackButtonVisible, onBackHandler } =
    useModalPageControl();

  return (
    <StyledHeader {...props}>
      {isBackButtonVisible && onBack && (
        <IconButton
          sx={{ position: 'absolute', left: '-8px' }}
          onClick={onBackHandler ?? onBack}
        >
          <FiArrowLeft />
        </IconButton>
      )}
      {total > 1 && (
        <PageControl size="large" total={total} current={current} />
      )}
    </StyledHeader>
  );
};
