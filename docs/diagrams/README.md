# Diagrams

This directory holds the editable sources for the diagrams used in the docs. The files can be opened in [draw.io](https://app.diagrams.net/), or in VS Code with the draw.io extension — the extension does everything the website does and is far more convenient.

When you change a diagram, re-export it as a PNG over the rendered image the table below lists for it, otherwise the docs will keep showing the old picture. Most sources share their base name with the image, but not all — follow the table rather than the file name.

| Source                               | Rendered image                             | Used by             |
| ------------------------------------ | ------------------------------------------ | ------------------- |
| `architecture.drawio`                | `images/architecture.png`                  | 01-Architecture     |
| `address-derivation.drawio`          | `images/address-derivation.drawio.png`     | 01-Architecture     |
| `background-architecture.drawio`     | `images/background-architecture.png`       | 02-Service-worker   |
| `window-ethereum-proxy.drawio`       | `images/inpage-initialization-process.png` | 05-Dapp-connections |
| `ledger-architecture.drawio`         | `images/ledger-architecture.png`           | 06-Ledger           |
| `ledger-signing-flow.drawio`         | `images/ledger-signing-flow.png`           | 06-Ledger           |
| `seedless-export-phrase-flow.drawio` | `images/seedless-export-phrase-flow.png`   | 10-Seedless         |

`images/inpage-provider-communication.png`, `images/seedless-onboarding-flow.png`, and `images/seedless-signing-flow.png` have no source file in this directory.

`images/screenshot1.png` and `images/screenshot2.png` are not diagrams — they illustrate the Chrome setup steps in the root [README](../../README.md).
