// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fetchP = import('node-fetch').then(mod => mod.default)
// @ts-ignore
const fetch = (...args) => fetchP.then(fn => fn(...args))
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	function setContent(content, options) {
		options = options || {
			language: 'javascript'
		};
		return vscode.workspace.openTextDocument({
			language: options.language
		})
			.then(doc => vscode.window.showTextDocument(doc))
			.then(editor => {
				let editBuilder = textEdit => {
					textEdit.insert(new vscode.Position(0, 0), String(content));

				};

				return editor.edit(editBuilder, {
					undoStopBefore: true,
					undoStopAfter: false
				})
					.then(() => editor);
			});
	}
	let disposable = vscode.commands.registerCommand('vspp.readURL', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		const window = vscode.window;
		if(editor){
			const {document, selection} = editor;
			const word = document.getText(selection);
			var script = fetch(word)
				.then((response) => response.text())
				.catch((error) => {
					vscode.window.showErrorMessage(error);
				})
				.then((responseJSON) => {
					setContent(responseJSON,"javascript")
				}).catch((error) => {
					vscode.window.showErrorMessage(error);
				})
			
			
		}
	
	});
	let ls = vscode.commands.registerCommand('vspp.ls',function (){
		const workspace = vscode.workspace
		const window = vscode.window
		const editor = window.activeTextEditor
		const terminal = window.activeTerminal
		const ip = window.createInputBox()
	})

	context.subscriptions.push(disposable);
	context.subscriptions.push(ls)
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
