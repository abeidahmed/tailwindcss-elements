# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- Add Accordion element

## [0.4.0] - 2024-05-25

### Changed

- Use `popover` attribute in the popover element ([#40](https://github.com/abeidahmed/tailwindcss-elements/pull/40))

### Fixed

- Do not click menuitem again ([#39](https://github.com/abeidahmed/tailwindcss-elements/pull/39))

## [0.3.1] - 2024-04-26

### Fixed

- Show dialog by default if `twc-dialog` element has the `open` attribute ([#37](https://github.com/abeidahmed/tailwindcss-elements/pull/37))
- Nested dialog resets `body` padding ([#36](https://github.com/abeidahmed/tailwindcss-elements/pull/36))

## [0.3.0] - 2024-03-08

### Added

- Add Tooltip element ([#31](https://github.com/abeidahmed/tailwindcss-elements/pull/31))
- Support arrow in Floating panel element ([#29](https://github.com/abeidahmed/tailwindcss-elements/pull/29))
- Allow trigger id to be set in the Floating panel element ([#28](https://github.com/abeidahmed/tailwindcss-elements/pull/28))

### Changed

- Set Floating Panel element's default strategy to "fixed" ([#33](https://github.com/abeidahmed/tailwindcss-elements/pull/33))

## [0.2.0] - 2024-01-14

### Added

- Add Floating panel element ([#24](https://github.com/abeidahmed/tailwindcss-elements/pull/24))

### Fixed

- Make dropdown element initially visible if `open` attribute is set ([#25](https://github.com/abeidahmed/tailwindcss-elements/pull/25))
- Export tabs element from `package.json` file ([#21](https://github.com/abeidahmed/tailwindcss-elements/pull/21))

## [0.1.0] - 2024-01-06

### Added

- Add Tabs element ([#14](https://github.com/abeidahmed/tailwindcss-elements/pull/14))
- Emit `twc-switch:change` cancelable event before toggling the switch ([#12](https://github.com/abeidahmed/tailwindcss-elements/pull/12))

### Changed

- Change `uniqueId` prefix to `twc` ([#11](https://github.com/abeidahmed/tailwindcss-elements/pull/11))

### Fixed

- Hide dialog element before Turbo caches the page ([#13](https://github.com/abeidahmed/tailwindcss-elements/pull/13))

## [0.0.1] - 2024-01-04

### Added

- Add Dialog element ([#6](https://github.com/abeidahmed/tailwindcss-elements/pull/6))
- Add Dropdown element ([#4](https://github.com/abeidahmed/tailwindcss-elements/pull/4))
- Add Popover element ([#3](https://github.com/abeidahmed/tailwindcss-elements/pull/3))
- Add Switch element ([#2](https://github.com/abeidahmed/tailwindcss-elements/pull/2))

[unreleased]: https://github.com/abeidahmed/tailwindcss-elements/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/abeidahmed/tailwindcss-elements/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/abeidahmed/tailwindcss-elements/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/abeidahmed/tailwindcss-elements/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/abeidahmed/tailwindcss-elements/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/abeidahmed/tailwindcss-elements/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/abeidahmed/tailwindcss-elements/releases/tag/v0.0.1
