/* global suite, test */
( function() {
    "use strict";

    const assert = require( 'assert' ),
        vscode = require( 'vscode' ),
        commands = require( '../src/commands' ),
        path = require( 'path' ),
        getContent = require( 'vscode-test-get-content' );

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

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move by a space', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord ^itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 20, 0, 20 );

                    commands.moveRight( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move when space is next', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord^ itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 19, 0, 19 );

                    commands.moveRight( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move over multiple whitespace', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord itsSuperFun   ^to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 32, 0, 32 );

                    commands.moveRight( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move over numbers', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345^wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 1, 26, 1, 26 );

                    commands.moveRight( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move over unicode', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'unicode.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'กั¥¼ abcÑñ^𝌀𝌃 𝌑𝍊\n' +
                        'właściwiePiękneLiterki właściwiePiękneLiterki';
                    textEditor.selection = new vscode.Selection( 0, 5, 0, 5 );

                    commands.moveRight( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move over unicode polish', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'unicode.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'กั¥¼ abcÑñ𝌀𝌃 𝌑𝍊\n' +
                        'właściwie^PiękneLiterki właściwiePiękneLiterki';
                    textEditor.selection = new vscode.Selection( 1, 1, 1, 1 );

                    commands.moveRight( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
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
                        '\taaa\n' +
                        'bb';
                    textEditor.selection = new vscode.Selection( 2, 6, 2, 6 );

                    commands.moveRight( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Supports multiple selections', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'this^IsACamelCase^Word itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could^ also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selections = [
                        new vscode.Selection( 0, 0, 0, 0 ),
                        new vscode.Selection( 0, 14, 0, 14 ),
                        new vscode.Selection( 1, 4, 1, 4 )
                    ];

                    commands.moveRight( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move before underscore in constant format', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'constant.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'THIS_FILE HAS_^SOME_CONSTANT_CONVENTION AND_ITS_FUN';
                    textEditor.selection = new vscode.Selection( 0, 18, 0, 18 );

                    commands.moveLeft( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move within camelCase collapsed', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'jsCode.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = '		let sel = textEditor.selections[ 0 ],\n' +
                        '			newPos = this._move^PositionRight( textEditor.document, sel.active );\n';
                    textEditor.selection = new vscode.Selection( 1, 30, 1, 30 );

                    commands.moveLeft( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move to whitespace collapsed', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord ^itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 0, 24, 0, 24 );

                    commands.moveLeft( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move from line boundary end', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with12345wordsToSee how it behaves with ^numbers';
                    textEditor.selection = new vscode.Selection( 1, 69, 1, 69 );

                    commands.moveLeft( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move over numbers', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'thisIsACamelCaseWord itsSuperFun   to	writeIn-CamelCase\n' +
                        'you could also mix it with^12345wordsToSee how it behaves with numbers';
                    textEditor.selection = new vscode.Selection( 1, 31, 1, 31 );

                    commands.moveLeft( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move over unicode', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'unicode.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = 'กั¥¼ abcÑñ𝌀𝌃 𝌑𝍊\n' +
                        'właściwie^PiękneLiterki właściwiePiękneLiterki';
                    textEditor.selection = new vscode.Selection( 1, 15, 1, 15 );

                    commands.moveLeft( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
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
                        '\taaa\n' +
                        'bb';
                    textEditor.selection = new vscode.Selection( 5, 0, 5, 0 );

                    commands.moveLeft( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move over empty lines with whitespace', function() {
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
                        'fancyWhitespaceTest file^\n' +
                        '\n' +
                        '\n' +
                        '\n' +
                        '\taaa\n' +
                        'bb';
                    textEditor.selection = new vscode.Selection( 9, 0, 9, 0 );

                    commands.moveLeft( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Move to line boundary beginning having whitespace before it', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'whitespaceTest.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = '\n' +
                        '\n' +
                        '^thisIs\n' +
                        '\n' +
                        '\n' +
                        'fancyWhitespaceTest file\n' +
                        '\n' +
                        '\n' +
                        '\n' +
                        '\taaa\n' +
                        'bb';
                    textEditor.selection = new vscode.Selection( 2, 4, 2, 4 );

                    commands.moveLeft( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
                } );
        } );

        test( 'Supports multiple selections', function() {
            return vscode.workspace.openTextDocument( path.join( __dirname, '_fixtures', 'camelCase.txt' ) )
                .then( ( doc ) => {
                    return vscode.window.showTextDocument( doc );
                } )
                .then( textEditor => {
                    let expected = '[this}IsACamelCa[se}Word itsSuperFun   to	writeIn-CamelCase\n' +
                        'you [could} also mix it with12345wordsToSee how it behaves with numbers';
                    textEditor.selections = [
                        new vscode.Selection( 0, 0, 0, 0 ),
                        new vscode.Selection( 0, 14, 0, 14 ),
                        new vscode.Selection( 1, 4, 1, 4 )
                    ];

                    commands.selectRight( textEditor );

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.equal( getContent.withSelection( textEditor ), expected );
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

                    assert.deepEqual( vals, [
                        [ 0, 'cd' ],
                        [ 1, 'AB' ],
                        [ 2, '12' ]
                    ] );
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

                    assert.deepEqual( vals, [
                        [ 0, '' ],
                        [ 1, 'AB' ],
                        [ 2, '12' ]
                    ] );
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

                    assert.deepEqual( vals, [
                        [ 0, 'cba' ]
                    ] );
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
            };

            testValue( 3, 'a' );
            testValue( 3, 'ś' );
            testValue( 3, 'ĉ' );
            testValue( 3, 'ű' );
            testValue( 3, 'aBC' );
            testValue( 2, 'B' );
            testValue( 2, 'Ś' );
            testValue( 2, 'Ĉ' );
            testValue( 2, 'Ű' );
            testValue( 2, 'Bac' );
            testValue( 1, '0' );
            testValue( 1, '-' );
            testValue( 1, '' );
            testValue( 4, ' ' );
        } );
    } );
} )();