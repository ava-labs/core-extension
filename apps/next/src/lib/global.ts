import { GlobalStylesProps, typographyClasses } from '@avalabs/k2-alpine';

export const globalStyles: GlobalStylesProps['styles'] = {
  [`.${typographyClasses.root}`]: {
    userSelect: 'none',
  },
};

let isInitialized = false;

export function initGlobalBehaviors() {
  if (isInitialized) return;

  document.addEventListener('contextmenu', preventMediaContextMenuAndDrag);
  document.addEventListener('dragstart', preventMediaContextMenuAndDrag);
  isInitialized = true;
}

function preventMediaContextMenuAndDrag(event: Event) {
  if (isMediaElement(event.target)) {
    event.preventDefault();
  }
}

function isMediaElement(element: EventTarget | null) {
  if (element == null) {
    return false;
  }

  return (
    element instanceof HTMLImageElement ||
    element instanceof SVGElement ||
    element instanceof HTMLVideoElement ||
    element instanceof HTMLCanvasElement
  );
}
