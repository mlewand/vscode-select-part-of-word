/* global suite, test */
( function() {
    "use strict";

    const assert = require( 'assert' ),
        vscode = require( 'vscode' ),
        path = require( 'path' ),
        editorHelpers = require( './editor' );

    suite( '_helpers.editor getContentWithSelections', function() {
        test( 'It returns a single collapsed selection', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '..', '_fixtures', 'singleLine.js' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    textEditor.selection = new vscode.Selection( 0, 1, 0, 1 );
                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), 'a^aa bbb' );
                } );
        } );

        test( 'It returns a single collapsed selection multiline', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '..', '_fixtures', 'multiLine.js' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'aaa ^bbb\n' +
                        'ccc ddd\n' +
                        'eee fff';

                    textEditor.selection = new vscode.Selection( 0, 4, 0, 4 );
                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'It returns multiple collapsed selections multiline', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '..', '_fixtures', 'multiLine.js' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'aaa ^b^bb\n' +
                        'ccc ddd^\n' +
                        '^eee fff';

                    textEditor.selections = [
                        new vscode.Selection( 0, 4, 0, 4 ),
                        new vscode.Selection( 0, 5, 0, 5 ),
                        new vscode.Selection( 1, 7, 1, 7 ),
                        new vscode.Selection( 2, 0, 2, 0 )
                    ];
                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'It returns a single ranged selection', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '..', '_fixtures', 'singleLine.js' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    textEditor.selection = new vscode.Selection( 0, 1, 0, 3 );
                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), 'a[aa} bbb' );
                } );
        } );

        test( 'It returns multiple ranged selections multiline', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '..', '_fixtures', 'multiLine.js' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'a[aa} bbb\n' +
                        'c{cc d]dd\n' +
                        'eee fff';

                    textEditor.selections = [
                        new vscode.Selection( 0, 1, 0, 3 ),
                        new vscode.Selection( 1, 5, 1, 1 )
                    ];
                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'It works with mixed selections', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '..', '_fixtures', 'multiLine.js' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'a^aa bbb\n' +
                        'c[cc }ddd\n' +
                        'eee fff';

                    textEditor.selections = [
                        new vscode.Selection( 0, 1, 0, 1 ),
                        new vscode.Selection( 1, 1, 1, 4 )
                    ];
                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );
    } );
} )();