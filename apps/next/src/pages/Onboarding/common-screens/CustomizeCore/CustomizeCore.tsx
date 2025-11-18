import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
import { useSubmitButton } from '@/hooks/useSubmitButton';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';
import { ViewMode } from '@core/types';
import { useAnalyticsContext, useSettingsContext } from '@core/ui';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavButton } from '../../components/NavButton';
import * as Styled from './components/Styled';
import { ViewModeOption } from './components/ViewModeOption';

type Props = OnboardingScreenProps & {
  onNext: () => void;
};

export const CustomizeCore: FC<Props> = ({ step, totalSteps, onNext }) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { setCurrent, setTotal } = useModalPageControl();
  const [selectedViewMode, setSelectedViewMode] =
    useState<ViewMode>('floating');
  const { setPreferredView } = useSettingsContext();

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, totalSteps, step]);

  const handleNextClick = useCallback(async () => {
    capture('OnboardingPreferredViewSelected', {
      preferredView: selectedViewMode,
    });
    await setPreferredView(selectedViewMode);
    onNext();
  }, [capture, onNext, selectedViewMode, setPreferredView]);

  const [nextButtonRef, shortcuts] = useSubmitButton();

  return (
    <>
      <FullscreenModalTitle>
        {t('Customize Core to your liking')}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(
          'Decide what default view works best for you, either a floating interface or a sidebar docked to the side to show more content',
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent {...shortcuts} pt={6}>
        <Styled.ToggleButtonGroup
          value={selectedViewMode}
          onChange={(_, value) => setSelectedViewMode((prev) => value ?? prev)}
          exclusive
        >
          <Styled.ToggleButton
            value={'floating' satisfies ViewMode}
            data-testid="floating-view-option"
          >
            <ViewModeOption viewMode="floating" label={t('Floating')} />
          </Styled.ToggleButton>
          <Styled.ToggleButton
            value={'sidebar' satisfies ViewMode}
            data-testid="sidebar-view-option"
          >
            <ViewModeOption viewMode="sidebar" label={t('Sidebar')} />
          </Styled.ToggleButton>
        </Styled.ToggleButtonGroup>
      </FullscreenModalContent>
      <FullscreenModalActions>
        <NavButton
          color="primary"
          onClick={handleNextClick}
          ref={nextButtonRef}
        >
          {t('Next')}
        </NavButton>
      </FullscreenModalActions>
    </>
  );
};
