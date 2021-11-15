# extension-avalanche

avalanche wallet browser extension

## Development

- `yarn dev` watches for changes.

### Chrome Dev

- Go to chrome://extensions/ and enable Developer mode.
- At the top left of the above url click `Load unpacked` and select the extension folder.

### Firefox Dev

go to `about:debugging#/runtime/this-firefox`
then click `Load Temporary Add-on`
point to either the `dist/manifest.json` or the zip file from running the build command.

## Build

- `yarn build` will run everything through webpack and create a zip file in the /builds directory
