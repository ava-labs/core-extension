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


