const vscode = require( 'vscode' ),
	commands = require( './src/commands' );

function activate( context ) {
	let moveRightCmd = vscode.commands.registerCommand( 'selectPartOfWord.moveRight', commands.moveRight, commands ),
		moveLeftCmd = vscode.commands.registerCommand( 'selectPartOfWord.moveLeft', commands.moveLeft, commands ),
		selectRightCmd = vscode.commands.registerCommand( 'selectPartOfWord.selectRight', commands.selectRight, commands ),
		selectLeftCmd = vscode.commands.registerCommand( 'selectPartOfWord.selectLeft', commands.selectLeft, commands ),
		backspaceCmd = vscode.commands.registerTextEditorCommand( 'selectPartOfWord.backspace', commands.backspace, commands );

	context.subscriptions.push( moveRightCmd );
	context.subscriptions.push( moveLeftCmd );
	context.subscriptions.push( selectRightCmd );
	context.subscriptions.push( selectLeftCmd );
	context.subscriptions.push( backspaceCmd );
}
exports.activate = activate;