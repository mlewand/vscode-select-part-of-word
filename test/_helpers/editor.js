let vscode = require( 'vscode' );

module.exports = {
    /**
     * Returns content of a given editor.
     *
     * @param {TextEditor} editor
     * @returns {String}
     */
    getContent( editor ) {
        let doc = editor.document,
            rng = new vscode.Range( 0, 0, doc.lineCount - 1, doc.lineAt( doc.lineCount - 1 ).text.length )

        return doc.getText( rng );
    },

    /**
     * Returns content of a given editor as a string. Selection are marked with special characters:
     *
     * * Collapsed selections are marked with `^`
     * * Ranged selections are marked with
     *  * `[` or `]` for **anchor** position, based whether it's a beginning or the end of range,
     *  * `{` or `}` for **active** position, based whether it's a beginning or the end of range.
     *
     * In case of ranged selections, **anchor** is basically a position where you started the range.
     *
     * It supports multiple selections.
     *
     * **Known issues**
     * * Currently it will mess up if there are multiple ranged selections that overlaps with each other. It
     * was designed simplification.
     *
     * @param {TextEditor} editor
     * @returns {String}
     */
    getContentWithSelections( editor ) {
        let ret = this.getContent( editor );

        for ( let sel of editor.selections.reverse() ) {
            ret = this._replaceSelection( ret, sel, editor.document );
        }

        return ret;
    },

    _replaceSelection( content, sel, doc ) {
        if ( sel.isEmpty ) {
            let selOffset = doc.offsetAt( sel.start );
            content = content.substr( 0, selOffset ) + '^' + content.substr( selOffset );
        } else {
            let startOffset = doc.offsetAt( sel.start ),
                endOffset = doc.offsetAt( sel.end ),
                startMarker = sel.start.isEqual( sel.active ) ? '{' : '[',
                endMarker = sel.end.isEqual( sel.active ) ? '}' : ']';

            content = content.substr( 0, startOffset ) + startMarker +
                content.substring( startOffset, endOffset ) + endMarker +
                content.substr( endOffset );
        }

        return content;
    }
}