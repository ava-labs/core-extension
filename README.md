# extension-avalanche

avalanche wallet browser extension

## Development

- `yarn dev` watches for changes.

### Chrome Dev

you will have to go to chrome://extensions/ and enable Developer mode.
click `Load unpacked` and select the `extension-avalanche/dist` directory.
Click the avalanche icon in the toolbar

### Firefox Dev

go to `about:debugging#/runtime/this-firefox`
then click `Load Temporary Add-on`
point to either the `dist/manifest.json` or the zip file from running the build command.

## Build

- `yarn build` will run everything through webpack and create a zip file in the /builds directory

## Extension Manual Install

1. got to chrome or brave `chrome://extensions/` url
2. At the top right make sure you have `developer mode turned on
3. After developer mode is turned on, at the top left should be `Load Unpacked`
4. Click `Load Unpacked` and go to the extension folder, make sure it is unzipped
5. select the folder or go into the folder and press select

Thats it!
