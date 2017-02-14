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
		textEditor = this._getEditor( textEditor );

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
		textEditor = this._getEditor( textEditor );

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
		textEditor = this._getEditor( textEditor );

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
		textEditor = this._getEditor( textEditor );

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
	 * @param {Boolean} [right]
	 */
	_movePosition( doc, position, right ) {
		let linesGenerator = this._getAheadLines( doc, position, Boolean( right ) ),
			endPos = null,
			curLine,
			nextLineFeed;

		// @todo extract it to a separate method.
		( function() {
			// First line is special, there's multiple different checks to be done.
			nextLineFeed = linesGenerator.next().value;

			curLine = nextLineFeed[ 0 ];

			let lineText = doc.lineAt( curLine ).text,
				// The text after the selection.
				siblingText = nextLineFeed[ 1 ],
				previousChar = right ? lineText[ position.character - 1 ] : lineText[ position.character ],
				lastCharType = this._getCharType( previousChar || ' ' ),
				curCharType = this._getCharType( siblingText[ 0 ] ),
				lineBoundaryPosition = right ? lineText.length : 0;

			if ( curCharType !== lastCharType ) {
				// Handles cases like (LTR):
				// is^CorrectColor
				// isC^orrectColor
				// is ^correct
				// is^ correct
				let farAheadCharType = this._getCharType( right ? siblingText[ 1 ] : siblingText.substr( -2, 1 ) ),
					moveOffset;

				if ( curCharType !== farAheadCharType ) {
					// Case 1 above, caret is before the first capitalized letter in camel case.
					if ( right ) {
						moveOffset = siblingText.substr( 1 ).search( regExpExcludeMapping[ farAheadCharType ] );

						endPos = moveOffset === -1 ?
							// No other characters found in this line.
							null : // Not found... @todo: we'll be skipping to next line here.
							// Note we're skipping first char (capitalized letter), and because of that we're adding 1.
							position.character + moveOffset + 1;
					} else {
						moveOffset = siblingText.search( regExpExcludeMapping[ curCharType ] );

						endPos = moveOffset === -1 ?
							// No other characters found in this line.
							null : // Not found... @todo: we'll be skipping to next line here.
							// Or just subtract offset from start char position.
							position.character - moveOffset;
					}

					if ( endPos === null && position.character !== lineBoundaryPosition ) {
						endPos = lineBoundaryPosition;
					}
				}
			}

			if ( endPos === null ) {
				exclusionPosition = right ? siblingText.search( regExpExcludeMapping[ curCharType ] ) :
					siblingText.search( regExpExcludeMapping[ curCharType ] );

				if ( exclusionPosition !== -1 ) {
					endPos = right ? position.character + exclusionPosition :
						position.character - exclusionPosition - 1;
				}
			}

			if ( endPos === null && position.character !== lineBoundaryPosition ) {
				endPos = lineBoundaryPosition;
			}
		} ).call( this );

		while ( endPos === null && ( nextLineFeed = linesGenerator.next().value ) ) {
			curLine = nextLineFeed[ 0 ];
			let lineText = nextLineFeed[ 1 ],
				match = lineText.search( /[^\s]/ );

			if ( match !== -1 ) {
				endPos = right ? match : lineText.length - match;
			}
		}

		// Final fallback - after all the iteration if nothing can be matched, move sel to doc end / beginning.
		if ( endPos === null ) {
			if ( right ) {
				return new vscode.Position( doc.lineCount - 1, doc.lineAt( doc.lineCount - 1 ).text.length );
			} else {
				return new vscode.Position( 0, 0 );
			}
		}

		return new vscode.Position( curLine, endPos );
	},

	/**
	 * Returns lines ahead your selection, e.g. for text like:
	 *
	 *		aa^aa
	 *		bb
	 *		cc
	 *
	 * Generator will return values: `[ 0, 'aa' ], [ 1, 'bb' ], [ 2, 'cc' ]`.
	 *
	 * **Note how for first line only text after/before caret gets returned.**
	 *
	 * @param {Position} startPosition
	 * @param {Boolean} [right=true] Tells the direction of generator. If `false` returned lines text is also **reversed**.
	 * @returns {Array} Array in form [ <lineNumber>, <lineContent> ], where lineNumber is a 0-based number.
	 */
	* _getAheadLines( doc, startPosition, right ) {
		right = right === undefined ? true : right;

		let curLine = startPosition.line,
			// By how much we change line per iteration? Negative if we're going back.
			lineNumberChange = right ? 1 : -1,
			isLineValid = lineNumber => lineNumber >= 0 && lineNumber < doc.lineCount,
			getLineText = lineNumber => {
				let ret = doc.lineAt( lineNumber ).text;

				if ( !right ) {
					ret = reverseString( ret );
				}

				// First line is a special case, where we want to return only content from/to startPosition.
				if ( lineNumber === startPosition.line ) {
					ret = ret.substr( right ? startPosition.character : ret.length - startPosition.character );
				}

				return ret;
			}

		while ( isLineValid( curLine ) ) {
			yield [
				curLine,
				getLineText( curLine )
			];

			// Set line number for further fetch.
			curLine += lineNumberChange;
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
	},

	/**
	 * Returns currently focused text editor.
	 *
	 * @param {TextEditor/null} [editor=null] If given it will be returned instead of looking for a default one.
	 * @returns {TextEditor/undefined}
	 */
	_getEditor( textEditor ) {
		return this._isTextEditor( textEditor ) ? textEditor : vscode.window.activeTextEditor;
	},

	/**
	 *
	 *
	 * @param {any} editor
	 * @returns {Boolean} `true` if `editor` looks like an instance of TextEditor.
	 */
	_isTextEditor( editor ) {
		return editor && editor.document;
	}
};