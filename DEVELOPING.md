# Developing

## Overview

- No pull requests. Just commit to main. Until there are collaborators.
- No squash commits needed

## Getting started

### Open the code that matters

The actual code for the extension sits in `nova-go-formatter.novaextension`. Open that code in a Nova project.

### Install development dependencies

- Install [Node.js](https://nodejs.org/en/download/)
- Install Node project dependencies for running [ESLint](https://eslint.org): `$ npm install`
- Install the [ESLint Extension for Nova](https://github.com/apexskier/nova-eslint)

# Requirements

Go Formatter requires [`gofmt`](https://pkg.go.dev/cmd/gofmt) to be installed. `gofmt` is included with the official [Go installer](https://go.dev/dl). Additionally, `gofmt` must be visible in your environment (e.g., via your `PATH` variable).

## Before committing

### Ensure there are no ESLint issues

ESLint issues will appear in Nova's Issues pane. If there are any issues, fix them.

Alternatively, you may view ESLint issues on the command line: `$ ./node_modules/.bin/eslint . `

### Ensure the extension functions as expected

First, activate the extension: **Extensions → Activate Project as Extension**.

Next, open the extension console to review `Go Formatter` log messages: **Extensions → Show Extension Console**.

Finally, try each of the usage paths:

- Save a Go file. Go Formatter will automatically format the file you are saving.
- Select the **Editor → Format Go file** menu item; or
- Open the command palette and type `Format Go file`

## Releasing

Releases are manually created with these steps:

1. Delete the `node_modules` directory, if it exists
1. Increment the version in `extension.json`
1. Update the release notes in `CHANGELOG.md`
1. Make any necessary updates to `README.md`. This contains the user-facing documentation in the Nova Extension Library.
1. Submit to the Nova Extension Library: **Extensions → Submit to the Extension Library...**
