import assert from 'assert';
import {codeSubstituter} from '../src/js/code-substituter';

const test1 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)','function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n'),
        'function foo(x, y, z) {\n' +
        '<LnClr_red>    if (x + 1 + y < z) {</LnClr_red>\n' +
        '        return x + y + z + 0 + 5;\n' +
        '<LnClr_green>    } else if (x + 1 + y < z * 2) {</LnClr_green>\n' +
        '        return x + y + z + 0 + x + 5;\n' +
        '    } else {\n' +
        '        return x + y + z + 0 + z + 5;\n' +
        '    }\n' +
        '}'
    );};


const test2 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)','function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    let d;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c + d;\n' +
            '    }\n' +
            '}\n'),
        'function foo(x, y, z) {\n' +
        '<LnClr_red>    if (x + 1 + y < z) {</LnClr_red>\n' +
        '        return x + y + z + 0 + 5;\n' +
        '<LnClr_green>    } else if (x + 1 + y < z * 2) {</LnClr_green>\n' +
        '        return x + y + z + 0 + x + 5;\n' +
        '    } else {\n' +
        '        return x + y + z + 0 + z + 5 + null;\n' +
        '    }\n' +
        '}'
    );};


const test3 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)','function foo(x, y, z) {\n' +
            '    while (x == 1)\n' +
            '        return x;\n' +
            '}'),

        'function foo(x, y, z) {\n' +
        '    while (x == 1)\n' +
        '        return x;\n' +
        '}'
    );};

const test4 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)',

            'function foo(x, y, z){\n' +
            '\tlet a = x + y + z;\n' +
            '\tlet b = x * y + z;\n' +
            '\tlet y = z;\n' +
            '\t\n' +
            '\tif (x == 2)\n' +
            '\t\treturn x;\n' +
            '\telse \n' +
            '\t\ty = 3;\n' +
            '\tif (1 + 1 - x * x + 1 - 1 == 1)\n' +
            '\t\treturn x;\n' +
            '}'),

        'function foo(x, y, z) {\n' +
        '<LnClr_red>    if (x == 2)</LnClr_red>\n' +
        '        return x;\n' +
        '    else\n' +
        '        y = 3;\n' +
        '<LnClr_green>    if (1 + 1 - x * x + 1 - 1 == 1)</LnClr_green>\n' +
        '        return x;\n' +
        '}'
    );};


const test5 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)','function foo(x, y, z) {\n' +
            '    while (x == 1)\n' +
            '        return y;\n' +
            '}'),

        'function foo(x, y, z) {\n' +
        '    while (x == 1)\n' +
        '        return y;\n' +
        '}'
    );};

const test6 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)','function foo(x, y, z) {\n' +
            '    while (y == 2)\n' +
            '        return x;\n' +
            '}'),

        'function foo(x, y, z) {\n' +
        '    while (y == 2)\n' +
        '        return x;\n' +
        '}'
    );};

const test7 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)','function foo(x, y, z) {\n' +
            '    while (x == 1)\n' +
            '        return z;\n' +
            '}'),

        'function foo(x, y, z) {\n' +
        '    while (x == 1)\n' +
        '        return z;\n' +
        '}'
    );};

const test8 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)','function foo(x, y, z) {\n' +
            '    while (z == 3)\n' +
            '        return x;\n' +
            '}'),

        'function foo(x, y, z) {\n' +
        '    while (z == 3)\n' +
        '        return x;\n' +
        '}'
    );};

const test9 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)','function foo(x, y, z) {\n' +
            '    while (z == 3)\n' +
            '        return z;\n' +
            '}'),

        'function foo(x, y, z) {\n' +
        '    while (z == 3)\n' +
        '        return z;\n' +
        '}'
    );};

const test10 = () => {
    assert.equal(
        codeSubstituter('(x=1, y=2, z=3)','function foo(x, y, z) {\n' +
            '    while (x == 1)\n' +
            '        return z;\n' +
            '}'),

        'function foo(x, y, z) {\n' +
        '    while (x == 1)\n' +
        '        return z;\n' +
        '}'
    );};


describe('ALL TESTS', () => {

    it('test 1:', test1);
    it('test 2:', test2);
    it('test 3:', test3);
    it('test 4:', test4);
    it('test 5:', test5);
    it('test 6:', test6);
    it('test 7:', test7);
    it('test 8:', test8);
    it('test 9:', test9);
    it('test 10:', test10);
});

