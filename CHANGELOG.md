# Change Log

All notable changes to the "Select part of word" extension will be documented in this file.

## [Unreleased]

### Fixed

- [#24](https://github.com/mlewand/vscode-select-part-of-word/issues/24) - Fixed a case where move left through CONSTANT_NOTATION might put caret off by one character.

## 1.0.0

### Added

- [#21](https://github.com/mlewand/vscode-select-part-of-word/issues/21) - Added a changelog.
- [#22](https://github.com/mlewand/vscode-select-part-of-word/issues/22) - Added a AppVeyor continuous integration.

### Changed

- [#20](https://github.com/mlewand/vscode-select-part-of-word/issues/20) - Numbers are now threated as a separate character group.

### Fixed

- [#23](https://github.com/mlewand/vscode-select-part-of-word/issues/23) - Fixed a buggy behavior when going though unicode chars mixed with non-alphanum chars.