# Go Formatter for Nova

[Go Formatter](https://extensions.panic.com/extensions/me.brudvik/me.brudvik.nova-go-formatter/) formats [Go](https://go.dev) code using [`goimports`](https://pkg.go.dev/golang.org/x/tools/cmd/goimports) or [`gofmt`](https://pkg.go.dev/cmd/gofmt).

There are three ways to run Go Formatter:

- **On save**: When a Go file is saved, it will automatically be formatted
- **Menu item**: Select the **Editor → Format Go code** menu item
- **Command palette**: Open the command palette and type `Format Go code`

## Using [`goimports`](https://pkg.go.dev/golang.org/x/tools/cmd/goimports)

To use `goimports`, it must be installed and visible in your environment (e.g., on your `PATH` variable). `goimports` can be installed with this shell command:

```
$ go install golang.org/x/tools/cmd/goimports@latest
```

## Using [`gofmt`](https://pkg.go.dev/cmd/gofmt)

To use `gofmt`:

1. Uncheck the `"Use goimports if available"` extension preference
2. Ensure `gofmt` is installed (included with the official [Go installer](https://go.dev/dl)) and visible in your environment (e.g., on your `PATH` variable)

## Issues

If Go Formatter fails to run, error messages will be shown as a Nova notification. If you run into an issue that you think Go Formatter should handle, please [submit a bug report](https://github.com/jbrudvik/nova-go-formatter/issues).

## Install

[Go Formatter at Nova's Extension Library](https://extensions.panic.com/extensions/me.brudvik/me.brudvik.nova-go-formatter/)

Or, install using Nova by selecting **Extensions → Extension Library...**, searching for **Go Formatter**, and clicking the **Install** button.
