# extension-avalanche

Avalanche Wallet Browser Extension.

## Prerequesites

- [Install Node](https://nodejs.org/en/blog/release/v16.16.0/) (version 16)
- [Install Yarn](https://classic.yarnpkg.com/lang/en/docs/install)

### Login to your NPM profile

This is so you can install `@avalabs` packages from the NPM registry:

Follow the instructions [here](https://docs.npmjs.com/accessing-npm-using-2fa#sign-in-from-the-command-line-using---auth-typeweb)

## Install

`yarn install` will install all the required dependencies for the project.

## Build

`yarn build` will run everything through webpack and create a `/dist` directory.

## Development

`yarn dev` watches for changes.

### Chrome or Brave Development

1. In Chrome or Brave, go to `chrome://extensions/`.
2. At the top right make sure you have `Developer mode` turned on:

<img src="./docs/screenshots/screenshot1.png" />

3. After `Developer mode` is turned on, at the top left should be `Load unpacked`:

<img src="./docs/screenshots/screenshot2.png" />

4. Click `Load unpacked` and go to the extension folder.
5. Select the `dist` folder and press `Select`.

### Firefox Development

1. Go to `about:debugging#/runtime/this-firefox`.
2. Click `Load Temporary Add-on`.
3. Point to either the `dist/manifest.json` or the zip file from running the build command.

## Release

All you need to do is to merge your release branch onto `main`.
