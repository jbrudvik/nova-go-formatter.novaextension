function displayError(message) {
  // Log error to console
  console.error(message);

  // Display error in notification to user
  const request = new NotificationRequest();
  request.body = message;
  nova.notifications.add(request).catch((err) => console.error(err, err.stack));
}

function stringPreview(s, previewLength) {
  return s.length <= previewLength ? s : `${s.substring(0, previewLength)}...`;
}

function gofmt(originalCode) {
  const options = {
    args: ["gofmt"],
  };
  const process = new Process("/usr/bin/env", options);

  const originalCodePreview = stringPreview(originalCode, 50);
  const command = `$ ${process.command} ${process.args.join(
    " "
  )} <<< """${originalCodePreview}"""`;
  let errorMessage = command;

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
      resolve(formattedCode);
    } else {
      reject(errorMessage);
    }
  });

  process.start();

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
  const errorMessageStart = "Error when attempting to format Go code";

  // Get original code
  const rangeEntireDocument = new Range(0, editor.document.length);
  let originalCode = "";
  try {
    originalCode = await editor.getTextInRange(rangeEntireDocument);
  } catch (e) {
    displayError(`${errorMessageStart}: Unable to read Go code\n\n${e}`);
  }

  // Run go fmt
  try {
    const formattedCode = await gofmt(originalCode);
    writeDocument(editor, formattedCode);
    console.log("Format Go code: Success");
  } catch (e) {
    displayError(`${errorMessageStart}: Failed to run gofmt command\n\n${e}`);
  }
}

// Menu item + Command
nova.commands.register("go-formatter.goFormat", formatGoCodeInEditor);

exports.activate = async () => {
  // On save
  nova.workspace.onDidAddTextEditor((editor) => {
    // Ensure that only Go code is automatically formatted
    // Nova should handle this based on extension metadata, but appears to not always do so
    if (editor.document.syntax === "go") {
      editor.onWillSave(formatGoCodeInEditor);
    }
  });
};

exports.deactivate = () => {};
