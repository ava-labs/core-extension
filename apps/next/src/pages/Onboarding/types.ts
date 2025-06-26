type Route = string;

export type OnboardingScreenProps = {
  nextScreenPath: Route;
  skipScreenPath?: Route;
  step: number;
  totalSteps: number;
};
