# Localization

## Overview

To expand the reach of Core to non-English native countries, we have introduced localization into the app. We use `react-i18next` in the code and the Crowdin platform to get content translated.

## Update process

1. Run the `i18next-scanner` via the `yarn scanner` command. It will generate the English JSON file by scanning through all of the source files.
2. Create your PR. The PR will fail if you have changes to texts that are not in the en.json file.
3. Merging the PR onto Main will upload the new language file to Crowdin
4. Localizations are not automatic at the moment. You need to request them in Crowdin from our vendor.
5. When there are new localizations available in Crowdin, the `crowdin_sync` action will automatically create a new PR to the extension repo. The action runs after each merge to the main branch and at midnight each day.
6. Test localization correctness and test the app with the new texts.
7. Merge the Crowdin PR. To merge the Crowdin PR you need to check the branch out and sign the commits on the branch. To do that you can use this command: `git rebase --exec 'git commit --amend --no-edit -n -S' -i main`.

## How to use it

**Default:**

```js
// Import the t function. Important to use it through the hook otherwise your component might not react to language changes.
const { t } = useTranslation();

// Use the t function to translate the English text
return (
  <OnboardingStepHeader
    testId="enter-recovery-phrase"
    title={t('Secret Recovery Phrase')}
    onClose={onCancel}
  />
);
```

**If you need to use interpolation or HTML elements in the translated text, use the `Trans` component**

```js
// Use the Trans component with the values prop to interpolate dynamic content
return (
  <Typography align="center" size={14} height="17px">
    <Trans
      i18nKey="{{domain}} wants to perform <br /> the following action"
      values={{ domain: action.site?.domain }}
    />
  </Typography>
);
```

**Change language**
To change the language or get the current language, use the `useLanguage` hook.

```js
const { availableLanguages, currentLanguage, changeLanguage } = useLanguage();
changeLanguage(lang.code);
```

## DOs and DON'Ts

- **DO NOT** use dynamic data directly in the translated content. Use `react-i18next`'s built-in interpolation for dynamic values
- **DO NOT** use the `t` function outside of components and functions (e.g. in enums). It would result in the texts not updating when the language changes since the `t` function would be only evaluated once when the file was loaded.
- **DO NOT** translate error messages returned by the backend to Dapps. It would make error handling a lot more difficult for dapps.
- **DO** make sure all texts are translated on the frontend of the extension
- **DO** run the scanner to detect changes when you make a PR that makes changes to the UI. CI will fail on Github if there are missing texts in the localization json.
- **DO** test your UI with different lengths of text. Messages are not the same in different languages. Yes, even switching to german should be handled gracefully on the UI.
