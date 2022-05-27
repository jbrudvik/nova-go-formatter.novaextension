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

async function formatGoCode(editor) {
  // Doubly-ensure that only Go code is formatted
  // Nova should handle this based on extension metadata, but appears to not always do so
  if (editor.document.syntax !== "go") {
    return Promise.resolve(null);
  }

  const options = {
    args: ["gofmt"],
  };
  const process = new Process("/usr/bin/env", options);

  const operationTitle = "Format Go code";
  const command = `$ ${process.command} ${process.args.join(" ")}`;
  let errorMessage = `Error when attempting to format Go code (via stdin): ${command}`;

  // Get original code
  const rangeEntireDocument = new Range(0, editor.document.length);
  let originalCode = "";
  try {
    originalCode = await editor.getTextInRange(rangeEntireDocument);
  } catch (e) {
    errorMessage += `\n\nUnable to read Go code\n\n${e}`;
    displayError(errorMessage);
    return Promise.reject(errorMessage);
  }

  // gofmt: stdin
  const writer = process.stdin.getWriter();
  writer.ready.then(() => {
    writer.write(originalCode);
    writer.close();
  });

  // gofmt: stdout
  let formattedCode = "";
  process.onStdout((line) => {
    formattedCode += line;
  });

  // gofmt: stderr
  process.onStderr((error) => {
    errorMessage += `\n\n${error}`;
  });

  // gofmt: on exit
  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  process.onDidExit((exitCode) => {
    if (exitCode === 0) {
      writeDocument(editor, formattedCode);
      const successMessage = `${operationTitle}: Success`;
      console.log(successMessage);
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
  nova.commands.register("go-formatter.goFormat", formatGoCode);

  nova.workspace.onDidAddTextEditor((editor) => {
    editor.onWillSave(formatGoCode);
  });
};

exports.deactivate = () => {};
