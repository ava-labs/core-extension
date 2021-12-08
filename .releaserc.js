/*
This file contains the configuration for semantic release, the library we use to tag the correct 
semantic version numbers onto releases. We have two release paths, one on main and one on release branch. 

In the code below we check the env variable RELEASE_BRANCH to decide what we should do. As of 
the time of this file semantic release does not support specifying a config file from their CLI, 
so this is the only we can have dynamic configs based on branch. 

To test run this file, first get a github token at https://github.com/settings/tokens
and add it to the GITHUB_TOKEN env variable then specify what branch you want to run (main or release) under RELEASE_BRANCH

$ export GITHUB_TOKEN=<token>
$ export RELEASE_BRANCH=<main or release>
$ run yarn run semantic-release -d


*/

const commitAnalyzerSetting = [
  '@semantic-release/commit-analyzer',
  {
    preset: 'angular',
    releaseRules: [
      {
        type: 'feat',
        release: 'minor',
      },
      {
        type: '*',
        release: 'patch',
      },
    ],
    parserOpts: {
      noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
    },
  },
];

const releaseReplaceSetting = [
  '@google/semantic-release-replace-plugin',
  {
    replacements: [
      {
        files: ['dist/manifest.json'],
        from: '"version": ".*"',
        // Remove "-alpha" string from the version in the manifest.
        // Chrome only supports numbers and dots in the version number.
        to: `"version": "<%= _.replace(nextRelease.version, /[^0-9.]/g, '') %>"`,
        results: [
          {
            file: 'dist/manifest.json',
            hasChanged: true,
            numMatches: 1,
            numReplacements: 1,
          },
        ],
        countMatches: true,
      },
    ],
  },
];

const execSetting = [
  '@semantic-release/exec',
  {
    prepareCmd: 'yarn zip',
  },
];

const execSettingPatchAnyCommits = [
  '@semantic-release/exec',
  {
    prepareCmd: 'yarn zip',
    analyzeCommitsCmd: 'echo patch',
  },
];

const githubSetting = [
  '@semantic-release/github',
  {
    assets: [
      {
        path: 'builds/avalanche-wallet-extension.zip',
        name: 'Avalanche-wallet-extension-${nextRelease.gitTag}.zip',
        label: 'Wallet Extension (${nextRelease.gitTag})',
      },
    ],
    failTitle: false,
    successComment: false,
    failComment: false,
    labels: false,
  },
];

const gitSetting = [
  '@semantic-release/git',
  {
    assets: ['package.json'],
    message:
      'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
  },
];

let plugins;
if (process.env && process.env.RELEASE_BRANCH === 'release') {
  plugins = [
    commitAnalyzerSetting,
    releaseReplaceSetting,
    execSetting,
    githubSetting,
    gitSetting,
  ];
} else {
  plugins = [
    releaseReplaceSetting,
    execSettingPatchAnyCommits,
    githubSetting,
    gitSetting,
  ];
}

module.exports = {
  branches: [
    {
      name: 'release',
    },
    {
      name: 'main',
      prerelease: 'alpha',
    },
  ],
  plugins,
};
