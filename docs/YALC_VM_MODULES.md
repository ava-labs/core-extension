# Using Yalc to Link VM Modules Locally

This document explains how we used [yalc](https://github.com/wclr/yalc) to link local vm-modules packages for development in this project.

## Overview

Yalc is a tool that helps you work with local packages more reliably than `npm link` or `yarn link`. It's particularly useful for linking packages from the `vm-modules` repository into this extension project during development.

## Setup

### 1. Install Yalc Globally

```bash
npm install -g yalc
# or
yarn global add yalc
```

### 2. Build Your Local VM Module

Navigate to your local vm-modules repository and build the package you want to link:

```bash
cd /path/to/vm-modules/packages/evm-module
pnpm install
pnpm build  # Build the package
```

## Linking Process

### Step 1: Publish the Package to Yalc Store

In the directory of the vm-module package you want to link:

```bash
cd /path/to/vm-modules/packages/evm-module
yalc publish
```

This command:

- Builds the package (if you have a `prepublishOnly` script)
- Copies it to the global yalc store (`~/.yalc/packages/`)
- Makes it available for linking

### Step 2: Link the Package in This Project

In the extension-avalanche project (and / or where you want to use it e.g. packages/service-worker/):

```bash
cd /path/to/extension-avalanche
yalc add @avalabs/evm-module
```

This will:

- Add the package to your `node_modules` via a symlink
- Update your `package.json` with: `"@avalabs/evm-module": "link:.yalc/@avalabs/evm-module"`
- Create/update `yalc.lock` to track the linked package

### Step 3: Install Dependencies

After linking, reinstall dependencies:

```bash
yarn install
```

## Updating Linked Packages

When you make changes to your local vm-module, you need to push the updates:

### Option 1: Push Updates (Recommended)

In your local vm-module directory:

```bash
cd /path/to/vm-modules/packages/evm-module
yalc push
```

or two steps

```bash
cd /path/to/vm-modules/packages/evm-module
yalc publish
```

and after that in the extension folder:

```bash
cd /path/to/extension-avalanche
yalc update
```

This will:

- Rebuild the package
- Update all projects that have linked this package
- Automatically update `node_modules` in consuming projects

### Option 2: Publish and Update

If `yalc push` doesn't work or you prefer explicit control:

```bash
# In your local package directory
cd /path/to/vm-modules/packages/evm-module
yalc publish

# In this project directory
cd /path/to/extension-avalanche
yalc update @avalabs/evm-module
yarn install
```

## Removing Linked Packages

To unlink a package and restore the original version from npm:

```bash
yalc remove @avalabs/evm-module
yarn install
```

This will:

- Remove the package from `node_modules`
- Update `package.json` to remove the `link:` reference
- Update `yalc.lock`

## Example: Linking EVM Module

Here's a complete example for linking the `@avalabs/evm-module`:

```bash
# 1. Navigate to your local vm-modules repository
cd /Users/vvasas/Desktop/dev/avalabs/vm-modules/packages/evm-module

# 2. Build the package
yarn build

# 3. Publish to yalc
yalc publish

# 4. Navigate to this project
cd /Users/vvasas/Desktop/dev/avalabs/extension-avalanche

# 5. Link the package
yalc add @avalabs/evm-module

# 6. Install dependencies
yarn install

# 7. During development, when you make changes to evm-module:
cd /Users/vvasas/Desktop/dev/avalabs/vm-modules/packages/evm-module
yarn build
yalc push  # This automatically updates extension-avalanche
```

## Package.json Changes

When you link a package with yalc, it updates your `package.json` files. For example:

**Before:**

```json
{
  "dependencies": {
    "@avalabs/evm-module": "3.0.7"
  }
}
```

**After linking:**

```json
{
  "dependencies": {
    "@avalabs/evm-module": "link:.yalc/@avalabs/evm-module"
  }
}
```

## Files Created by Yalc

Yalc creates the following files/directories:

- `.yalc/` - Directory in your project root containing linked packages
- `yalc.lock` - Lock file tracking which packages are linked

**Note:** The `.yalc` folder should be in `.gitignore` and not committed to version control.

## Best Practices

1. **Always build before publishing:** Make sure your vm-module is built before running `yalc publish`:

   ```bash
   yarn build
   yalc publish
   ```

2. **Use `yalc push` during development:** When actively developing, use `yalc push` in your package directory to automatically update all consuming projects.

3. **Commit `yalc.lock`:** The `yalc.lock` file should be committed to version control to track which packages are linked.

4. **Don't commit `.yalc` folder:** The `.yalc` folder should be in `.gitignore`.

5. **Clean up before production builds:** Make sure to remove yalc links before building for production:
   ```bash
   yalc remove @avalabs/evm-module
   yarn install
   ```

## Troubleshooting

### Package not updating

If changes aren't reflected:

1. Make sure you've run `yalc push` or `yalc publish` in the package directory
2. Try `yalc update` in the consuming project
3. Clear `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   yarn install
   ```

### Build errors

If you get build errors:

1. Make sure the linked package is built: `cd /path/to/package && yarn build`
2. Check that the package's `package.json` has the correct `main`, `module`, or `exports` fields
3. Verify the package structure matches what's expected

### Dependency conflicts

If you encounter dependency conflicts:

1. Check that peer dependencies are satisfied
2. Use `yalc installations clean` to clean up orphaned installations
3. Remove and re-add the package:
   ```bash
   yalc remove @avalabs/evm-module
   yalc add @avalabs/evm-module
   yarn install
   ```

## Comparison with Other Methods

| Method             | Pros                                                                        | Cons                                                      |
| ------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------- |
| **yalc**           | Reliable, tracks links, works with monorepos, automatic updates with `push` | Requires manual updates                                   |
| **npm/yarn link**  | Built-in, simple                                                            | Can cause issues with peer dependencies, symlink problems |
| **link: protocol** | Simple, no extra tools                                                      | Requires package.json changes, manual path management     |
| **Symlinks**       | Fast, direct                                                                | Can break with some tools, requires manual management     |

## See Also

- [Yalc GitHub Repository](https://github.com/wclr/yalc) - Official yalc documentation
- Alternative linking methods (if documented elsewhere in the project)
