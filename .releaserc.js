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
        to: '"version": "${nextRelease.version}"',
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

let plugins = [releaseReplaceSetting, execSetting, githubSetting, gitSetting];

if (process.env && process.env.RELEASE_BRANCH === 'release') {
  plugins = [commitAnalyzerSetting, ...plugins];
} else {
  execSetting[1].analyzeCommitsCmd = 'echo patch';
}

module.exports = {
  branches: [
    {
      name: 'release',
    },
    {
      name: 'test-alpha',
      prerelease: true,
    },
    {
      name: 'test-beta',
      prerelease: true,
    },
  ],
  plugins,
};
