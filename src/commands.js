const common = require( './common' ),
	vscode = require( 'vscode' ),
	CHAR_TYPE = common.CHAR_TYPE,
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
			endPos = null;

		for ( [ curLine, textAhead ] of linesGenerator ) {
			if ( curLine === position.line ) {
				// First line has some special handling.
				endPos = this._movePositionFirstLine( doc, position, right, textAhead );
			} else {
				let match = textAhead.search( /[^\s]/ );

				if ( match !== -1 ) {
					endPos = right ? match : textAhead.length - match;
				}
			}

			if ( endPos !== null ) {
				break;
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

	_movePositionFirstLine( doc, position, right, textAhead ) {
		let endPos = null,
			curCharType = this._getCharType( textAhead[ 0 ] || '' ),
			farAheadCharType = this._getCharType( textAhead[ 1 ] || '' ),
			match = textAhead.search( common.regExpExcludeMapping[ curCharType ] ),
			// Empty textAhead means that the caret is at boundary position.
			isBoundaryPosiiton = textAhead === '',
			// Some matchings will require adjustment.
			matchAdjustment = 0;

		if ( right && farAheadCharType !== curCharType &&
			curCharType !== common.CHAR_TYPE.WHITESPACE && farAheadCharType !== common.CHAR_TYPE.WHITESPACE ) {
			// Catches a case like: foo^BarBaz.
			match = textAhead.substr( 1 ).search( common.regExpExcludeMapping[ farAheadCharType ] );
			matchAdjustment = 1;
		}

		if ( match !== -1 ) {
			endPos = position.character + ( match * ( right ? 1 : -1 ) ) + matchAdjustment;
		} else if ( !isBoundaryPosiiton ) {
			// No textAhead means that the caret is in boundary position.
			endPos = right ? doc.lineAt( position.line ).text.length : 0;
		}

		return endPos;
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
			};

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