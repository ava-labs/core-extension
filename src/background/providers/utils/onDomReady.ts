export default function onDomReady(callback) {
  if (['interactive', 'complete'].includes(document.readyState)) {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback, {
      once: true,
    });
  }
}
