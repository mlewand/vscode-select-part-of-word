const vscode = require( 'vscode' ),
	commands = require( './src/commands' );

function activate( context ) {
	let moveRightCmd = vscode.commands.registerTextEditorCommand( 'selectPartOfWord.moveRight', commands.moveRight, commands ),
		moveLeftCmd = vscode.commands.registerTextEditorCommand( 'selectPartOfWord.moveLeft', commands.moveLeft, commands ),
		selectRightCmd = vscode.commands.registerTextEditorCommand( 'selectPartOfWord.selectRight', commands.selectRight, commands ),
		selectLeftCmd = vscode.commands.registerTextEditorCommand( 'selectPartOfWord.selectLeft', commands.selectLeft, commands );

	context.subscriptions.push( moveRightCmd );
	context.subscriptions.push( moveLeftCmd );
	context.subscriptions.push( selectRightCmd );
	context.subscriptions.push( selectLeftCmd );
}
exports.activate = activate;