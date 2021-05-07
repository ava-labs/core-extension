/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!******************************!*\
  !*** ./src/contentscript.ts ***!
  \******************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
// const metamaskStream = new LocalMessageDuplexStream({
//   name: 'inpage',
//   target: 'contentscript',
// });
var shouldInjectProvider = function () {
    return (doctypeCheck() &&
        suffixCheck() &&
        documentElementCheck() &&
        !blockedDomainCheck());
};
/**
 * Checks the doctype of the current document if it exists
 *
 * @returns {boolean} {@code true} if the doctype is html or if none exists
 */
var doctypeCheck = function () {
    var doctype = window.document.doctype;
    if (doctype) {
        return doctype.name === 'html';
    }
    return true;
};
/**
 * Returns whether or not the extension (suffix) of the current document is prohibited
 *
 * This checks {@code window.location.pathname} against a set of file extensions
 * that we should not inject the provider into. This check is indifferent of
 * query parameters in the location.
 *
 * @returns {boolean} whether or not the extension of the current document is prohibited
 */
var suffixCheck = function () {
    var prohibitedTypes = [/\.xml$/u, /\.pdf$/u];
    var currentUrl = window.location.pathname;
    for (var i = 0; i < prohibitedTypes.length; i++) {
        if (prohibitedTypes[i].test(currentUrl)) {
            return false;
        }
    }
    return true;
};
/**
 * Checks the documentElement of the current document
 *
 * @returns {boolean} {@code true} if the documentElement is an html node or if none exists
 */
var documentElementCheck = function () {
    var documentElement = document.documentElement.nodeName;
    if (documentElement) {
        return documentElement.toLowerCase() === 'html';
    }
    return true;
};
/**
 * Checks if the current domain is blocked
 *
 * @returns {boolean} {@code true} if the current domain is blocked
 */
var blockedDomainCheck = function () {
    var blockedDomains = [
        'dropbox.com',
        'cdn.shopify.com/s/javascripts/tricorder/xtld-read-only-frame.html',
    ];
    var currentUrl = window.location.href;
    var currentRegex;
    for (var i = 0; i < blockedDomains.length; i++) {
        var blockedDomain = blockedDomains[i].replace('.', '\\.');
        currentRegex = new RegExp("(?:https?:\\/\\/)(?:(?!" + blockedDomain + ").)*$", 'u');
        if (!currentRegex.test(currentUrl)) {
            return true;
        }
    }
    return false;
};
var injectScript = function (content) {
    try {
        var container = document.head || document.documentElement;
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('async', 'false');
        scriptTag.textContent = content;
        container.insertBefore(scriptTag, container.children[0]);
        container.removeChild(scriptTag);
    }
    catch (error) {
        console.error(' Provider injection failed.', error);
    }
};
if (shouldInjectProvider()) {
    console.log('line 115');
    var inpageBundle = alert('inpage bundler, line 115');
    injectScript(inpageBundle);
    // initializeProvider({
    //   connectionStream: metamaskStream,
    // });
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmFsYW5jaGUtZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnRzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFJQSx3REFBd0Q7QUFDeEQsb0JBQW9CO0FBQ3BCLDZCQUE2QjtBQUM3QixNQUFNO0FBRU4sSUFBTSxvQkFBb0IsR0FBRztJQUMzQixPQUFPLENBQ0wsWUFBWSxFQUFFO1FBQ2QsV0FBVyxFQUFFO1FBQ2Isb0JBQW9CLEVBQUU7UUFDdEIsQ0FBQyxrQkFBa0IsRUFBRSxDQUN0QixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNILElBQU0sWUFBWSxHQUFHO0lBQ1gsV0FBTyxHQUFLLE1BQU0sQ0FBQyxRQUFRLFFBQXBCLENBQXFCO0lBQ3BDLElBQUksT0FBTyxFQUFFO1FBQ1gsT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQztLQUNoQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBRUY7Ozs7Ozs7O0dBUUc7QUFDSCxJQUFNLFdBQVcsR0FBRztJQUNsQixJQUFNLGVBQWUsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvQyxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUM1QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdkMsT0FBTyxLQUFLLENBQUM7U0FDZDtLQUNGO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsSUFBTSxvQkFBb0IsR0FBRztJQUMzQixJQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQztJQUMxRCxJQUFJLGVBQWUsRUFBRTtRQUNuQixPQUFPLGVBQWUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLENBQUM7S0FDakQ7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUNGOzs7O0dBSUc7QUFDSCxJQUFNLGtCQUFrQixHQUFHO0lBQ3pCLElBQU0sY0FBYyxHQUFHO1FBQ3JCLGFBQWE7UUFDYixtRUFBbUU7S0FDcEUsQ0FBQztJQUNGLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ3hDLElBQUksWUFBWSxDQUFDO0lBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzlDLElBQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVELFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FDdkIsNEJBQTBCLGFBQWEsVUFBTyxFQUM5QyxHQUFHLENBQ0osQ0FBQztRQUNGLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUYsSUFBTSxZQUFZLEdBQUcsVUFBQyxPQUFZO0lBQ2hDLElBQUk7UUFDRixJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUM7UUFDNUQsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6QyxTQUFTLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUNoQyxTQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekQsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNsQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNyRDtBQUNILENBQUMsQ0FBQztBQUVGLElBQUksb0JBQW9CLEVBQUUsRUFBRTtJQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQ3JELFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzQix1QkFBdUI7SUFDdkIsc0NBQXNDO0lBQ3RDLE1BQU07Q0FDUCIsImZpbGUiOiJjb250ZW50c2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3dlYmV4dGVuc2lvbi1wb2x5ZmlsbC10cyc7XG5pbXBvcnQgZXh0ZW5zaW9uaXplciBmcm9tICdleHRlbnNpb25pemVyJztcbmltcG9ydCB7IGluaXRpYWxpemVQcm92aWRlciB9IGZyb20gJ0BtZXRhbWFzay9pbnBhZ2UtcHJvdmlkZXInO1xuXG4vLyBjb25zdCBtZXRhbWFza1N0cmVhbSA9IG5ldyBMb2NhbE1lc3NhZ2VEdXBsZXhTdHJlYW0oe1xuLy8gICBuYW1lOiAnaW5wYWdlJyxcbi8vICAgdGFyZ2V0OiAnY29udGVudHNjcmlwdCcsXG4vLyB9KTtcblxuY29uc3Qgc2hvdWxkSW5qZWN0UHJvdmlkZXIgPSAoKSA9PiB7XG4gIHJldHVybiAoXG4gICAgZG9jdHlwZUNoZWNrKCkgJiZcbiAgICBzdWZmaXhDaGVjaygpICYmXG4gICAgZG9jdW1lbnRFbGVtZW50Q2hlY2soKSAmJlxuICAgICFibG9ja2VkRG9tYWluQ2hlY2soKVxuICApO1xufTtcblxuLyoqXG4gKiBDaGVja3MgdGhlIGRvY3R5cGUgb2YgdGhlIGN1cnJlbnQgZG9jdW1lbnQgaWYgaXQgZXhpc3RzXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgZG9jdHlwZSBpcyBodG1sIG9yIGlmIG5vbmUgZXhpc3RzXG4gKi9cbmNvbnN0IGRvY3R5cGVDaGVjayA9ICgpID0+IHtcbiAgY29uc3QgeyBkb2N0eXBlIH0gPSB3aW5kb3cuZG9jdW1lbnQ7XG4gIGlmIChkb2N0eXBlKSB7XG4gICAgcmV0dXJuIGRvY3R5cGUubmFtZSA9PT0gJ2h0bWwnO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBleHRlbnNpb24gKHN1ZmZpeCkgb2YgdGhlIGN1cnJlbnQgZG9jdW1lbnQgaXMgcHJvaGliaXRlZFxuICpcbiAqIFRoaXMgY2hlY2tzIHtAY29kZSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9IGFnYWluc3QgYSBzZXQgb2YgZmlsZSBleHRlbnNpb25zXG4gKiB0aGF0IHdlIHNob3VsZCBub3QgaW5qZWN0IHRoZSBwcm92aWRlciBpbnRvLiBUaGlzIGNoZWNrIGlzIGluZGlmZmVyZW50IG9mXG4gKiBxdWVyeSBwYXJhbWV0ZXJzIGluIHRoZSBsb2NhdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gd2hldGhlciBvciBub3QgdGhlIGV4dGVuc2lvbiBvZiB0aGUgY3VycmVudCBkb2N1bWVudCBpcyBwcm9oaWJpdGVkXG4gKi9cbmNvbnN0IHN1ZmZpeENoZWNrID0gKCkgPT4ge1xuICBjb25zdCBwcm9oaWJpdGVkVHlwZXMgPSBbL1xcLnhtbCQvdSwgL1xcLnBkZiQvdV07XG4gIGNvbnN0IGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvaGliaXRlZFR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHByb2hpYml0ZWRUeXBlc1tpXS50ZXN0KGN1cnJlbnRVcmwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBDaGVja3MgdGhlIGRvY3VtZW50RWxlbWVudCBvZiB0aGUgY3VycmVudCBkb2N1bWVudFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSB7QGNvZGUgdHJ1ZX0gaWYgdGhlIGRvY3VtZW50RWxlbWVudCBpcyBhbiBodG1sIG5vZGUgb3IgaWYgbm9uZSBleGlzdHNcbiAqL1xuY29uc3QgZG9jdW1lbnRFbGVtZW50Q2hlY2sgPSAoKSA9PiB7XG4gIGNvbnN0IGRvY3VtZW50RWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5ub2RlTmFtZTtcbiAgaWYgKGRvY3VtZW50RWxlbWVudCkge1xuICAgIHJldHVybiBkb2N1bWVudEVsZW1lbnQudG9Mb3dlckNhc2UoKSA9PT0gJ2h0bWwnO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBjdXJyZW50IGRvbWFpbiBpcyBibG9ja2VkXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgY3VycmVudCBkb21haW4gaXMgYmxvY2tlZFxuICovXG5jb25zdCBibG9ja2VkRG9tYWluQ2hlY2sgPSAoKSA9PiB7XG4gIGNvbnN0IGJsb2NrZWREb21haW5zID0gW1xuICAgICdkcm9wYm94LmNvbScsXG4gICAgJ2Nkbi5zaG9waWZ5LmNvbS9zL2phdmFzY3JpcHRzL3RyaWNvcmRlci94dGxkLXJlYWQtb25seS1mcmFtZS5odG1sJyxcbiAgXTtcbiAgY29uc3QgY3VycmVudFVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICBsZXQgY3VycmVudFJlZ2V4O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrZWREb21haW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYmxvY2tlZERvbWFpbiA9IGJsb2NrZWREb21haW5zW2ldLnJlcGxhY2UoJy4nLCAnXFxcXC4nKTtcbiAgICBjdXJyZW50UmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgYCg/Omh0dHBzPzpcXFxcL1xcXFwvKSg/Oig/ISR7YmxvY2tlZERvbWFpbn0pLikqJGAsXG4gICAgICAndSdcbiAgICApO1xuICAgIGlmICghY3VycmVudFJlZ2V4LnRlc3QoY3VycmVudFVybCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBpbmplY3RTY3JpcHQgPSAoY29udGVudDogYW55KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgY29uc3Qgc2NyaXB0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgc2NyaXB0VGFnLnNldEF0dHJpYnV0ZSgnYXN5bmMnLCAnZmFsc2UnKTtcbiAgICBzY3JpcHRUYWcudGV4dENvbnRlbnQgPSBjb250ZW50O1xuICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoc2NyaXB0VGFnLCBjb250YWluZXIuY2hpbGRyZW5bMF0pO1xuXG4gICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKHNjcmlwdFRhZyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignIFByb3ZpZGVyIGluamVjdGlvbiBmYWlsZWQuJywgZXJyb3IpO1xuICB9XG59O1xuXG5pZiAoc2hvdWxkSW5qZWN0UHJvdmlkZXIoKSkge1xuICBjb25zb2xlLmxvZygnbGluZSAxMTUnKTtcbiAgbGV0IGlucGFnZUJ1bmRsZSA9IGFsZXJ0KCdpbnBhZ2UgYnVuZGxlciwgbGluZSAxMTUnKTtcbiAgaW5qZWN0U2NyaXB0KGlucGFnZUJ1bmRsZSk7XG4gIC8vIGluaXRpYWxpemVQcm92aWRlcih7XG4gIC8vICAgY29ubmVjdGlvblN0cmVhbTogbWV0YW1hc2tTdHJlYW0sXG4gIC8vIH0pO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==