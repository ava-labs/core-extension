# extension-avalanche

avalanche wallet browser extension

## Prerequesites

### Install Yarn

```sh
npm install --global yarn
```

### Login to your NPM profile via the CLI

This is so you can install `@avalabs` packages from the NPM registry:

```sh
npx npm-cli-login -u YOUR_NPM_USERNAME -p YOUR_NPM_PASSWORD -e YOUR_NPM_EMAIL
```

You can also [set up an access token](https://docs.npmjs.com/creating-and-viewing-access-tokens) if you prefer.

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
