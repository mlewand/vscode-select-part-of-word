/* global suite, test */
( function() {
    "use strict";

    var assert = require( 'assert' );

    var vscode = require( 'vscode' );
    var myExtension = require( '../extension' );
    var commands = require( '../src/commands' );
    var Range = vscode.Range;
    let path = require( 'path' );
    let editorHelpers = require( './_helpers/editor' );

    suite( 'commamnds.moveRight', function() {
        test( 'Move within same text case collapsed', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'this^IsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 0, 0, 0 );

                    commands.moveRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Move within same text case ranged', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'this^IsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 0, 0, 1 );

                    commands.moveRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Move within camel case ranged', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIs^ACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 0, 0, 4 );

                    commands.moveRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Move over whitespace', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord itsSuperFun   ^to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 32, 0, 32 );

                    commands.moveRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );
    } );


    suite( 'commamnds.moveLeft', function() {
        test( 'Move within same text case collapsed', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'this^IsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 6, 0, 6 );

                    commands.moveLeft( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Move from just after capitalized', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'this^IsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 5, 0, 5 );

                    commands.moveLeft( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );
    } );

    suite( 'commamnds.selectRight', function() {
        test( 'Expand within same text case collapsed', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = '[this}IsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 0, 0, 0 );

                    commands.selectRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Expand within same text case ranged', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = '[this}IsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 0, 0, 1 );

                    commands.selectRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Expand within camel case ranged', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = '[thisIs}ACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 0, 0, 4 );

                    commands.selectRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );
    } );

    suite( '_getCharType', function() {
        test( '_getCharType', function() {
            let testValue = ( expected, valueUsed ) => {
                assert.strictEqual( commands._getCharType( valueUsed ), expected, valueUsed );
            }

            testValue( 3, 'a' );
            testValue( 3, 'aBC' );
            testValue( 2, 'B' );
            testValue( 2, 'Bac' );
            testValue( 1, '0' );
            testValue( 1, '-'  );
            testValue( 1, ' '  );
            testValue( 1, ''  );
        } )
    } )
} )();