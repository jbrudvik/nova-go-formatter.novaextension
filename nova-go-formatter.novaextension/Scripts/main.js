function stringPreview(s, previewLength) {
  return s.length <= previewLength ? s : `${s.substring(0, previewLength)}...`;
}

function basename(str) {
  return str.substr(str.lastIndexOf("/") + 1);
}

function displayError(message) {
  // Log error to console
  console.error(message);

  // Display error in notification to user
  const request = new NotificationRequest();
  request.body = message;
  nova.notifications.add(request).catch((err) => console.error(err, err.stack));
}

function getFilename(editor) {
  let filename = "untitled";
  const { path } = editor.document;
  if (path) {
    filename = basename(path);
  }
  return filename;
}

// Returns a promise containing a formatter process
// Returned formatter process must:
// - Read source code from stdin
// - Output formatter source code to stdout
// - Output error messages to stderr
// - Use zero exit code on success; otherwise non-zero exit code
function getFormatterProcess() {
  let resolve;
  const promise = new Promise((_resolve) => {
    resolve = _resolve;
  });

  const goimportsCommand = "goimports";
  const gofmtCommand = "gofmt";
  const goimportsProcess = new Process("/usr/bin/env", {
    args: [goimportsCommand],
  });
  const gofmtProcess = new Process("/usr/bin/env", {
    args: [gofmtCommand],
  });

  const useGoimportsIfAvailable = nova.config.get(
    `${nova.extension.identifier}.use-goimports-if-available`
  );

  if (useGoimportsIfAvailable) {
    const goimportsAvailabilityCheckProcess = new Process("/usr/bin/env", {
      args: ["command", "-v", goimportsCommand],
    });
    goimportsAvailabilityCheckProcess.onDidExit((exitCode) => {
      if (exitCode === 0) {
        console.log(
          "Using goimports: goimports picked in preferences and is also available"
        );
        resolve(goimportsProcess);
      } else {
        console.log(
          "Using gofmt: goimports picked in preferences but is not available. To install goimports, run this shell command: $ go install golang.org/x/tools/cmd/goimports@latest"
        );
        resolve(gofmtProcess);
      }
    });
    goimportsAvailabilityCheckProcess.start();
  } else {
    console.log("Using gofmt: gofmt picked in preferences");
    resolve(gofmtProcess);
  }
  return promise;
}

// Formatter process must:
// - Read source code from stdin
// - Output formatter source code to stdout
// - Output error messages to stderr
// - Use zero exit code on success; otherwise non-zero exit code
function formatGoCode(formatterProcess, originalCode) {
  // The start of a useful error message
  const originalCodePreview = stringPreview(originalCode, 50);
  const command = `$ ${formatterProcess.command} ${formatterProcess.args.join(
    " "
  )} <<< """${originalCodePreview}"""`;
  let errorMessage = command;

  // stdin: The unformatted code
  const writer = formatterProcess.stdin.getWriter();
  writer.ready.then(() => {
    writer.write(originalCode);
    writer.close();
  });

  // stdout: The formatted code
  let formattedCode = "";
  formatterProcess.onStdout((line) => {
    formattedCode += line;
  });

  // stderr: Error messages during formatting
  formatterProcess.onStderr((error) => {
    errorMessage += `\n\n${error}`;
  });

  // On exit: Processing is done (successful or not)
  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  formatterProcess.onDidExit((exitCode) => {
    if (exitCode === 0) {
      resolve(formattedCode);
    } else {
      reject(errorMessage);
    }
  });

  formatterProcess.start();

  return promise;
}

async function writeDocument(editor, content) {
  const rangeEntireDocument = new Range(0, editor.document.length);
  await editor.edit((edit) => {
    // Only write if there are changes
    const originalText = editor.getTextInRange(rangeEntireDocument);
    if (originalText !== content) {
      edit.replace(rangeEntireDocument, content);
    }
  });
}

async function formatGoCodeInEditor(editor) {
  const filename = getFilename(editor);
  const errorMessageStart = "Failure to format Go code";
  console.log(`Formatting Go code: ${filename}`);

  // Get formatter process
  let formatterProcess;
  try {
    formatterProcess = await getFormatterProcess();
  } catch (e) {
    displayError(
      `${errorMessageStart}: Unable to find Go formatter to use\n\n{e}`
    );
    return;
  }

  // Get original code
  const rangeEntireDocument = new Range(0, editor.document.length);
  let originalCode = "";
  try {
    originalCode = await editor.getTextInRange(rangeEntireDocument);
  } catch (e) {
    displayError(`${errorMessageStart}: Unable to read Go code\n\n${e}`);
    return;
  }

  // Format Go code
  try {
    const formattedCode = await formatGoCode(formatterProcess, originalCode);
    writeDocument(editor, formattedCode);
    console.log(`Formatted Go code: ${filename}`);
  } catch (e) {
    displayError(`${errorMessageStart}: Failed to run Go formatter\n\n${e}`);
  }
}

// Menu item + Command
nova.commands.register(
  `${nova.extension.identifier}.goFormat`,
  formatGoCodeInEditor
);

function formatGoCodeInEditorOnSave(editor) {
  const formatGoFilesOnSave = nova.config.get(
    `${nova.extension.identifier}.format-go-files-on-save`
  );
  if (formatGoFilesOnSave) {
    formatGoCodeInEditor(editor);
  }
}

exports.activate = async () => {
  // On save
  nova.workspace.onDidAddTextEditor((editor) => {
    // Ensure that only Go code is automatically formatted
    // Nova should handle this based on extension metadata, but appears to not always do so
    if (editor.document.syntax === "go") {
      editor.onWillSave(formatGoCodeInEditorOnSave);
    }
  });
};

exports.deactivate = () => {};
