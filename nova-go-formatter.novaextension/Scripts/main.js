function displayError(message) {
  // Log error to console
  console.error(message);

  // Display error in notification to user
  const request = new NotificationRequest();
  request.body = message;
  nova.notifications.add(request).catch((err) => console.error(err, err.stack));
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

async function formatGoFile(editor) {
  // Doubly-ensure that only Go files are formatted
  // Nova should handle this based on extension metadata, but appears to not always do so
  if (editor.document.syntax !== "go") {
    return Promise.resolve(null);
  }

  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  const options = {
    args: ["gofmt", editor.document.path],
  };
  const operationTitle = "Format Go file";
  const command = `$ ${options.args.join(" ")}`;
  const commandMessage = `${operationTitle}: ${command}`;

  console.log(commandMessage);

  const process = new Process("/usr/bin/env", options);

  let formattedCode = "";
  let errorMessage = `Error when attempting to format Go file:\n\n${command}`;

  process.onStdout((line) => {
    formattedCode += line;
  });

  process.onStderr((error) => {
    errorMessage += `\n\n${error}`;
  });

  process.onDidExit((exitCode) => {
    if (exitCode === 0) {
      const successMessage = `${operationTitle}: Success`;
      console.log(successMessage);
      writeDocument(editor, formattedCode);
      resolve(null);
    } else {
      displayError(errorMessage);
      reject(errorMessage);
    }
  });

  process.start();

  return promise;
}

exports.activate = async () => {
  nova.commands.register("go-formatter.goFormat", formatGoFile);

  nova.workspace.onDidAddTextEditor((editor) => {
    editor.onWillSave(formatGoFile);
  });
};

exports.deactivate = () => {};
