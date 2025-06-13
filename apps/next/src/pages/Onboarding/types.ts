type Route = string;

export type OnboardingScreenProps = {
  nextScreenPath: Route;
  step: number;
  totalSteps: number;
};
