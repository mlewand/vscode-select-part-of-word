const vscode = require( 'vscode' ),
	commands = require( './src/commands' );

function activate( context ) {
	let moveRightCmd = vscode.commands.registerTextEditorCommand( 'selectPartOfWord.moveRight', commands.moveRight, commands ),
		selectRightCmd = vscode.commands.registerTextEditorCommand( 'selectPartOfWord.selectRight', commands.selectRight, commands ),
		moveLeftCmd = vscode.commands.registerTextEditorCommand( 'selectPartOfWord.moveLeft', commands.moveLeft, commands );

	context.subscriptions.push( moveRightCmd );
	context.subscriptions.push( selectRightCmd );
	context.subscriptions.push( moveLeftCmd );
}
exports.activate = activate;