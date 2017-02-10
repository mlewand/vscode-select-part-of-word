const common = require( './common' ),
	vscode = require( 'vscode' ),
	CHAR_TYPE = common.CHAR_TYPE,
	STRATEGIES = {
		CAMEL_CASE: 1,
		SAME_CASE: 2
	},
	regExpMapping = common.regExpMapping,
	regExpExcludeMapping = common.regExpExcludeMapping;

module.exports = {
	moveRight( textEditor ) {
		let sel = textEditor.selections[ 0 ],
			newPos = this._movePositionRight( textEditor.document, sel.active );

		if ( newPos ) {
			// Update the selection.
			textEditor.selection = new vscode.Selection( newPos, newPos );
		}
	},

	/**
	 * Expands (or shrinks depending where range's active position is) the selection to the right side of text.
	 *
	 * @param {TextEditor} textEditor
	 */
	selectRight( textEditor ) {
		let sel = textEditor.selections[ 0 ],
			newPos = this._movePositionRight( textEditor.document, sel.active ),
			newSel = new vscode.Selection( sel.anchor, newPos );

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
			lastCharType = this._getCharType( position.character > 0 ? lineText.substr( position.character - 1, 1 ) : ' ' ),
			endLine = position.line,
			curCharType = this._getCharType( textAhead[ 0 ] ),
			endPos;

		if ( curCharType === lastCharType ) {
			// If we had a couple of same case letters, we just want to put the selection before the first
			// occurrence of a different case.
			endPos = position.character + textAhead.search( regExpExcludeMapping[ curCharType ] ) + 1;
		} else {
			// Hanles cases like:
			// is^CorrectColor
			// isC^orrectColor
			// is ^correct
			// is^ correct

			let farAheadCharType = this._getCharType( textAhead[ 1 ] );

			if ( curCharType !== farAheadCharType ) {
				// Case 1 above, caret is before the first capitalized letter in camel case.
				// Note we're skipping first char (capitalized letter), and because of that we're adding 2.
				endPos = position.character + textAhead.substr( 1 ).search( regExpExcludeMapping[ farAheadCharType ] ) + 2;
			} else {
				endPos = position.character + textAhead.search( regExpExcludeMapping[ curCharType ] ) + 1;
			}
		}

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