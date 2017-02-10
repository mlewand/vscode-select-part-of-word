const CHAR_TYPE = {
		OTHER: 1,
		UPPER_CASE: 2,
		LOWER_CASE: 3
	},
	regExpMapping = {
		[ CHAR_TYPE.LOWER_CASE ]: /[a-z]/,
		[ CHAR_TYPE.UPPER_CASE ]: /[A-Z]/
	},
	// RegExp to match anything BUT the type referenced by a key.
	regExpExcludeMapping = {
		[ CHAR_TYPE.LOWER_CASE ]: /.(?![a-z])/,
		[ CHAR_TYPE.UPPER_CASE ]: /.(?![A-Z])/,
		[ CHAR_TYPE.OTHER ]: /[a-zA-Z0-9]/
	};

const vscode = require( 'vscode' );

module.exports = {
	moveRight( textEditor ) {
		let newSel = this._moveSelectionRight( textEditor.document, textEditor.selections[ 0 ] );

		if ( newSel ) {
			// Update the selection.
			textEditor.selection = newSel;
		}
	},


	/**
	 * Expands (or shrinks depending where range's active position is) the selection to the right side of text.
	 *
	 * @param {TextEditor} textEditor
	 */
	selectRight( textEditor ) {
		let sel = textEditor.selections[ 0 ];
		let newPos = this._movePositionRight( textEditor.document, sel.active );
		let newSel = new vscode.Selection( sel.anchor, newPos );

		if ( newSel ) {
			// Update the selection.
			textEditor.selection = newSel;
		}
	},

	moveLeft( textEditor ) {},

	_moveSelectionRight( doc, sel ) {
		let end = !sel.isReversed ? sel.end : sel.start,
			anchor = !sel.isReversed ? sel.start : sel.end,
			lineText = doc.lineAt( end ).text,
			// The text after the selection.
			textAhead = lineText.substr( end.character ),
			lastChar = end.character > 0 ? lineText.substr( end.character - 1, 1 ) : ' ';

		return new vscode.Selection( anchor, end.with( end.line, end.character + 1 ) );
	},

	_movePositionRight( doc, position ) {
		let lineText = doc.lineAt( position ).text,
			// The text after the selection.
			textAhead = lineText.substr( position.character ),
			lastChar = position.character > 0 ? lineText.substr( position.character - 1, 1 ) : ' ',
			endLine = position.line,
			endPos = null;

		let curCharacterType = this._getCharType( textAhead[ 0 ] );

		endPos = position.character + textAhead.search( regExpExcludeMapping[ curCharacterType ] ) + 1;

		if ( endPos === -1 ) {
			return position;
		} else {
			// return position.with( position.line, endPos + 1 );
			return new vscode.Position( position.line, endPos );
		}
	},

	/**
	 * Tells the character type based on `char`.
	 *
	 * @param {String} char A character to be tested.
	 * @returns {Number} A value based on `CHAR_TYPE` members.
	 */
	_getCharType( char ) {
		char = String( char )[ 0 ] || '';

		for ( let typeValue in regExpMapping ) {
			if ( char.match( regExpMapping[ typeValue ] ) ) {
				return Number( typeValue );
			}
		}

		return CHAR_TYPE.OTHER;
	}
};