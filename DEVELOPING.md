# Developing

### Required dependencies

- Install [Node.js](https://nodejs.org/en/download/)
- Install Node project dependencies: `$ npm install`
- Install [`gofmt`](https://pkg.go.dev/cmd/gofmt). `gofmt` is included with the official [Go installer](https://go.dev/dl). Additionally, `gofmt` must be visible in your environment (e.g., via your `PATH` variable).
- Install [`goimports`](https://pkg.go.dev/golang.org/x/tools/cmd/goimports): `$ go install golang.org/x/tools/cmd/goimports@latest`

## Before committing

```sh
# Format all code correctly
$ npm run format

# Ensure code is free of common mistakes
$ npm run lint

# Ensure all tests pass
$ npm test
```

## Developing with Nova

### Included tasks

- Build (`cmd+b`): Install dependencies, format, lint, test
- Clean (`shift+cmd+k`): Prepare for release

### Useful extensions

- [Prettier for Nova](https://extensions.panic.com/extensions/alexanderweiss/alexanderweiss.prettier/): Run Prettier on save
- [ESLint Extension for Nova](https://extensions.panic.com/extensions/apexskier/apexskier.eslint/): Show ESLint errors as Nova Issues

## Manual testing

Setup:

1. Activate the extension: **Extensions → Activate Project as Extension**.
1. Open the extension console to review `Go Formatter` log messages: **Extensions → Show Extension Console**.

Usage paths to test:

- Save a Go file. Go Formatter will automatically format the file you are saving.
- Select the **Editor → Format Go code** menu item
- Open the command palette and type `Format Go code`

Variables for usage paths:

- `"Use goimports if available"` preference option checked/unchecked
- `"Format Go files on save"` preference option checked/unchecked
- Underlying dependencies installed and available (e.g., on `PATH`):
  - `goimports`
  - `gofmt`
- Filetype: Go, non-Go, unnamed

## Releasing

Releases are manually created with these steps:

1. Push any changes to GitHub and Ensure build is passing: [![Build](https://github.com/jbrudvik/nova-go-formatter/actions/workflows/build.yml/badge.svg)](https://github.com/jbrudvik/nova-go-formatter/actions/workflows/build.yml)
1. `$ npm run clean`
1. Increment the version in `extension.json`
1. Update the release notes in `CHANGELOG.md`
1. Make any necessary updates to `README.md`. This contains the user-facing documentation in the Nova Extension Library.
1. Submit to the Nova Extension Library: **Extensions → Submit to the Extension Library...**
