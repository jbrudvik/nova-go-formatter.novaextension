**Go Formatter** formats [Go](https://go.dev) code using [`gofmt`](https://pkg.go.dev/cmd/gofmt).

There are three ways to run Go Formatter:

- **On save**: When a Go file is saved, it will automatically be formatted
- **Menu item**: Select the **Editor → Format Go code** menu item
- **Command palette**: Open the command palette and type `Format Go code`

If Go Formatter fails to run (e.g., `gofmt` fails to run), you'll see a Nova notification with error messages. If you run into an issue that you think Go Formatter should handle, please [submit a bug report](https://github.com/jbrudvik/nova-go-formatter/issues).

## Requirements

Go Formatter requires [`gofmt`](https://pkg.go.dev/cmd/gofmt) to be installed. `gofmt` is included with the official [Go installer](https://go.dev/dl). Additionally, `gofmt` must be visible in your environment (e.g., via your `PATH` variable).
