# Go Formatter, a Nova extension

Go Formatter is a [Nova](https://nova.app) extension that formats [Go](https://go.dev) files using [`gofmt`](https://pkg.go.dev/cmd/gofmt):

- On every save
- When you select the menu item
- And using the command palette

## Requirements

Go Formatter requires [`gofmt`](https://pkg.go.dev/cmd/gofmt) to be installed. `gofmt` is included with the official [Go installer](https://go.dev/dl). Additionally, `gofmt` must be visible in your environment (e.g., via your `PATH` variable).

## Usage

There are three ways to run Go Formatter:

- Save a Go file. Go Formatter will automatically format the file you are saving.
- Select the **Editor → Format Go file** menu item; or
- Open the command palette and type `Format Go file`

If Go Formatter fails to run successfully (e.g., `gofmt` fails to run), you'll see a Nova notification with error messages. If you run into an issue that you think Go Formatter should handle, please [submit a bug report](https://github.com/jbrudvik/nova-go-formatter/issues).
