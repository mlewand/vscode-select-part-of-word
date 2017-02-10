let vscode = require( 'vscode' );

module.exports = {
    getContent( editor ) {
        let doc = editor.document,
            rng = new vscode.Range( 0, 0, doc.lineCount - 1, doc.lineAt( doc.lineCount - 1 ).text.length )

        return doc.getText( rng );
    },

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
            content = 'ranged sel unsupported :()';
        }

        return content;
    }
}