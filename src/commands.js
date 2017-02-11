const common = require( './common' ),
	vscode = require( 'vscode' ),
	CHAR_TYPE = common.CHAR_TYPE,
	STRATEGIES = {
		CAMEL_CASE: 1,
		SAME_CASE: 2
	},
	regExpMapping = common.regExpMapping,
	regExpExcludeMapping = common.regExpExcludeMapping;

function reverseString( input ) {
	return [ ...input ].reverse().join( '' );
}

module.exports = {
	/**
	 * Moves the selection to the right side. It will always collapse the range.
	 *
	 * Reference point is the __active__ boundary of the selection.
	 *
	 * @param {TextEditor} textEditor
	 */
	moveRight( textEditor ) {
		let sel = textEditor.selections[ 0 ],
			newPos = this._movePositionRight( textEditor.document, sel.active );

		if ( newPos ) {
			// Update the selection.
			textEditor.selection = new vscode.Selection( newPos, newPos );
		}
	},

	/**
	 * Moves the selection to the left side. It will always collapse the range.
	 *
	 * Reference point is the __active__ boundary of the selection.
	 *
	 * @param {TextEditor} textEditor
	 */
	moveLeft( textEditor ) {
		let sel = textEditor.selections[ 0 ],
			newPos = this._movePositionLeft( textEditor.document, sel.active );

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

	/**
	 * Expands (or shrinks depending where range's active position is) the selection to the left side of text.
	 *
	 * @param {TextEditor} textEditor
	 */
	selectLeft( textEditor ) {
		let sel = textEditor.selections[ 0 ],
			newPos = this._movePositionLeft( textEditor.document, sel.active ),
			newSel = new vscode.Selection( sel.anchor, newPos );

		if ( newSel ) {
			// Update the selection.
			textEditor.selection = newSel;
		}
	},

	_movePositionRight( doc, position ) {
		return this._movePosition( doc, position, true );
	},

	_movePositionLeft( doc, position ) {
		return this._movePosition( doc, position, false );
	},

	/**
	 * A generic method for {@link _movePositionRight} and {@link _movePositionLeft}.
	 *
	 * @param {TextDocument} doc
	 * @param {Position} position
	 */
	_movePosition( doc, position, right ) {
		let lineText = doc.lineAt( position ).text,
			// The text after the selection.
			siblingText = right ? lineText.substr( position.character ) : lineText.substr( 0, position.character ),
			previousChar = right ? lineText.substr( position.character - 1, 1 ) : lineText[ position.character ],
			lastCharType = this._getCharType( previousChar || ' ' ),
			curCharType = this._getCharType( right ? siblingText[ 0 ] : siblingText[ siblingText.length - 1 ] ),
			endPos = null;

		if ( curCharType !== lastCharType ) {
			// Handles cases like (LTR):
			// is^CorrectColor
			// isC^orrectColor
			// is ^correct
			// is^ correct
			let farAheadCharType = this._getCharType( siblingText[ 1 ] ),
				moveOffset;

			if ( curCharType !== farAheadCharType ) {
				// Case 1 above, caret is before the first capitalized letter in camel case.
				if ( right ) {
					moveOffset = siblingText.substr( 1 ).search( regExpExcludeMapping[ farAheadCharType ] );

					endPos = moveOffset === - 1 ?
						// No other characters found in this line.
						lineText.length :
						// Note we're skipping first char (capitalized letter), and because of that we're adding 1.
						position.character + moveOffset + 1;
				} else {
					moveOffset = reverseString( siblingText ).search( regExpExcludeMapping[ curCharType ] );

					endPos = moveOffset === -1 ?
						// No other characters found in this line.
						0 :
						// Or just subtract offset from start char position.
						position.character - moveOffset;
				}
			}
		}

		if ( endPos === null ) {
			exclusionPosition = right ? siblingText.search( regExpExcludeMapping[ curCharType ] ) :
				reverseString( siblingText ).search( regExpExcludeMapping[ curCharType ] );

			if ( exclusionPosition !== -1 ) {
				endPos = right ? position.character + exclusionPosition :
					position.character - exclusionPosition - 1;
			} else {
				endPos = right ? lineText.length : 0;
			}
		}

		return new vscode.Position( position.line, endPos );
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