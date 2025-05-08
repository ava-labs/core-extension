import { MobileStepper } from '@avalabs/core-k2-components';

interface PageTrackerrProps {
  steps: number;
  activeStep: number;
}

export function PageTracker({ steps, activeStep }: PageTrackerrProps) {
  return (
    <MobileStepper
      backButton={null}
      nextButton={null}
      variant="dots"
      steps={steps}
      position="static"
      activeStep={activeStep}
      sx={(theme) => ({
        backgroundColor: 'transparent',
        justifyContent: 'center',
        flexGrow: 1,
        '& .MuiMobileStepper-dot': {
          margin: `0 ${theme.spacing(0.5)}`,
        },
        '& .MuiMobileStepper-dotActive': {
          backgroundColor: 'secondary.main',
        },
      })}
    />
  );
}
