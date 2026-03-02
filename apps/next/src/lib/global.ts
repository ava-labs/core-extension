import { GlobalStylesProps, typographyClasses } from '@avalabs/k2-alpine';

export const globalStyles: GlobalStylesProps['styles'] = {
  [`.${typographyClasses.root}`]: {
    userSelect: 'none',
  },
};

function disableEventForMediaElement(event: Event) {
  const { target } = event;
  if (
    target != null &&
    (target instanceof HTMLImageElement ||
      target instanceof SVGElement ||
      target instanceof HTMLVideoElement ||
      target instanceof HTMLCanvasElement)
  ) {
    return event.preventDefault();
  }
  return false;
}

document.addEventListener('contextmenu', disableEventForMediaElement);
document.addEventListener('dragstart', disableEventForMediaElement);
