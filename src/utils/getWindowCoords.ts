/**
 * Using this to get the screen metadata of the extension. This way
 * we can use that to make an accurate placement of confirmation screens
 */
export function getWindowCoords() {
  return {
    viewportWidth: window.visualViewport.width,
    viewPortHeight: window.visualViewport.height,
    screenX: window.screenX,
    screenY: window.screenY,
  };
}
