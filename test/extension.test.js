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

    suite( 'commands.moveRight', function() {
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

        test( 'Move over empty lines', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'whitespaceTest.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = '\n' +
                        '\n' +
                        'thisIs\n' +
                        '\n' +
                        '\n' +
                        '^fancyWhitespaceTest file\n' +
                        '\n' +
                        '\n' +
                        '\n' +
                        'aaa\n' +
                        'bb';
                    textEditor.selection = new vscode.Selection( 2, 6, 2, 6 );

                    commands.moveRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Move to boundary end', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord itsSuperFun   to	writeIn-CamelCase^\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 51, 0, 51 );

                    commands.moveRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );
    } );

    suite( 'commands.moveLeft', function() {
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

        test( 'Move to line boundary beginning', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = '^thisIsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 4, 0, 4 );

                    commands.moveLeft( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Move from line boundary end', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with^ numbers';
                    textEditor.selection = new vscode.Selection( 1, 69, 1, 69 );

                    commands.moveLeft( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Move over empty lines', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'whitespaceTest.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = '\n' +
                        '\n' +
                        'thisIs^\n' +
                        '\n' +
                        '\n' +
                        'fancyWhitespaceTest file\n' +
                        '\n' +
                        '\n' +
                        '\n' +
                        'aaa\n' +
                        'bb';
                    textEditor.selection = new vscode.Selection( 5, 0, 5, 0 );

                    commands.moveLeft( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );
    } );

    suite( 'commands.selectRight', function() {
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

        test( 'Expand to contain boundary end', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with [numbers}';
                    textEditor.selection = new vscode.Selection( 1, 62, 1, 62 );

                    commands.selectRight( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );
    } );

    suite( 'commands.selectLeft', function() {
        test( 'Expand within same text case collapsed', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsA{Camel]CaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 12, 0, 12 );

                    commands.selectLeft( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Expand within same text case ranged', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsA{Camel]CaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 12, 0, 10 );

                    commands.selectLeft( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );

        test( 'Expand within camel case ranged', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamel{CaseWord] itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 20, 0, 16 );

                    commands.selectLeft( textEditor );

                    assert.equal( editorHelpers.getContentWithSelections( textEditor ), expected );
                } );
        } );
    } );

    suite( '_getAheadLines', function() {
        test( 'it returns correct values for right iteration', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'generatorTest.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let linesGenerator = commands._getAheadLines( textEditor.document, new vscode.Position( 0, 2 ), true ),
                        vals = [],
                        curLine;

                    while ( ( curLine = linesGenerator.next() ) && curLine.value ) {
                        vals.push( curLine.value );
                    }

                    assert.deepEqual( vals, [ [ 0, 'cd' ], [ 1, 'AB' ], [ 2, '12' ] ] );
                } );
        } );

        test( 'it includes empty trailing line', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'generatorTest.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let linesGenerator = commands._getAheadLines( textEditor.document, new vscode.Position( 0, 4 ), true ),
                        vals = [],
                        curLine;

                    while ( ( curLine = linesGenerator.next() ) && curLine.value ) {
                        vals.push( curLine.value );
                    }

                    assert.deepEqual( vals, [ [ 0, '' ], [ 1, 'AB' ], [ 2, '12' ] ] );
                } );
        } );

        test( 'it works with edge cases', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'generatorTest.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let linesGenerator = commands._getAheadLines( textEditor.document, new vscode.Position( 0, 4 ), true );
                    assert.deepEqual( linesGenerator.next().value, [ 0, '' ] );

                    // Beginning.
                    linesGenerator = commands._getAheadLines( textEditor.document, new vscode.Position( 0, 0 ), true );
                    assert.deepEqual( linesGenerator.next().value, [ 0, 'abcd' ] );
                } );
        } );

        test( 'supports reversed iteration', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'generatorTest.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let linesGenerator = commands._getAheadLines( textEditor.document, new vscode.Position( 0, 3 ), false ),
                        vals = [],
                        curLine;

                    while ( ( curLine = linesGenerator.next() ) && curLine.value ) {
                        vals.push( curLine.value );
                    }

                    assert.deepEqual( vals, [ [ 0, 'cba' ] ] );
                } );
        } );

        test( 'supports reversed iteration edge cases', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'generatorTest.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let linesGenerator = commands._getAheadLines( textEditor.document, new vscode.Position( 0, 4 ), false );
                    assert.deepEqual( linesGenerator.next().value, [ 0, 'dcba' ] );

                    // Beginning.
                    linesGenerator = commands._getAheadLines( textEditor.document, new vscode.Position( 0, 0 ), false );
                    assert.deepEqual( linesGenerator.next().value, [ 0, '' ] );
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
            testValue( 1, '-' );
            testValue( 1, ' ' );
            testValue( 1, '' );
        } )
    } )
} )();