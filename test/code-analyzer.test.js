import assert from 'assert';
import {parseCode, extractBody} from '../src/js/code-analyzer';

const test1 = () => {
    assert.equal(
        JSON.stringify(parseCode('')),
        '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
    );};

const test2 = () => {
    assert.equal(
        JSON.stringify(parseCode('let a = 1;')),
        '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
    );};

const test3 = () => {
    assert.equal(
        JSON.stringify(parseCode('function swap(array, i, j) {\n' +
            '  var temp = array[i];\n' +
            '  array[i] = array[j];\n' +
            '  array[j] = temp;\n' +
            '}')),
        '{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"swap","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":13}}},"params":[{"type":"Identifier","name":"array","loc":{"start":{"line":1,"column":14},"end":{"line":1,"column":19}}},{"type":"Identifier","name":"i","loc":{"start":{"line":1,"column":21},"end":{"line":1,"column":22}}},{"type":"Identifier","name":"j","loc":{"start":{"line":1,"column":24},"end":{"line":1,"column":25}}}],"body":{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"temp","loc":{"start":{"line":2,"column":6},"end":{"line":2,"column":10}}},"init":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array","loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":18}}},"property":{"type":"Identifier","name":"i","loc":{"start":{"line":2,"column":19},"end":{"line":2,"column":20}}},"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":21}}},"loc":{"start":{"line":2,"column":6},"end":{"line":2,"column":21}}}],"kind":"var","loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":22}}},{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array","loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":7}}},"property":{"type":"Identifier","name":"i","loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":9}}},"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":10}}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array","loc":{"start":{"line":3,"column":13},"end":{"line":3,"column":18}}},"property":{"type":"Identifier","name":"j","loc":{"start":{"line":3,"column":19},"end":{"line":3,"column":20}}},"loc":{"start":{"line":3,"column":13},"end":{"line":3,"column":21}}},"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":21}}},"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":22}}},{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"array","loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":7}}},"property":{"type":"Identifier","name":"j","loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":9}}},"loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":10}}},"right":{"type":"Identifier","name":"temp","loc":{"start":{"line":4,"column":13},"end":{"line":4,"column":17}}},"loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":17}}},"loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":18}}}],"loc":{"start":{"line":1,"column":27},"end":{"line":5,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":5,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":5,"column":1}}}'
    );
};

const test4 =() => {
    assert.equal(
        JSON.stringify(extractBody('function binarySearch(X){\n' +
            '    while (low <= high) \n' +
            '    return -1;\n' +
            '}')[1].line),1
    );
};

const test5 = () => {
    assert.equal(
        JSON.stringify(extractBody('function binarySearch(X, V, n){\n' +
            '    let low, high, mid;\n' +
            '    low = 0;\n' +
            '    high = n - 1;\n' +
            '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n' +
            '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' +
            '            low = mid + 1;\n' +
            '        else\n' +
            '            return mid;\n' +
            '    }\n' +
            '    return -1;\n' +
            '}')[1].line),1
    );
};

const test6 = () => {
    assert.equal(
        JSON.stringify(extractBody('for(let i = 1; i < 4; i++)\n' +
            '{let j = 1};')[1].line),1
    );
};

const test7 = () => {
    assert.equal(
        JSON.stringify(extractBody('for(let i = 1; i < 4; i++)\n' +
            '{let j = 1};')[1].line),1
    );
};

const test8 = () => {
    assert.equal(
        JSON.stringify(extractBody('function binarySearch(X, V, n){\n' +
            '    let low, high, mid;\n' +
            '    low = 0;\n' +
            '    high = n - 1;\n' +
            '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n' +
            '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' +
            '            low = mid + 1;\n' +
            '              else if (X > V[mid])\n' +
            '                 low = mid + 1;\n' +
            '        else\n' +
            '            return mid;}\n' +
            '    return -1;\n' +
            '}')[1].line),1
    );
};

const test9 = () => {
    assert.equal(
        JSON.stringify(extractBody('function binarySearch(X, V){\n' +
            '  if (X < V[mid])\n' +
            '          return X\n' +
            '   else\n' +
            '        return V;\n' +
            '}')[1].line),1
    );
};

const test10 = () => {
    assert.equal(
        JSON.stringify(parseCode('')),
        '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
    );
};

const test11 = () => {
    assert.equal(
        JSON.stringify(extractBody('obj = { "table":"customers", "limit":10 };\n' +
            'dbParam = JSON.stringify(obj);\n' +
            'xmlhttp = new XMLHttpRequest();\n' +
            'xmlhttp.onreadystatechange = function() {\n' +
            '    if (this.readyState == 4 && this.status == 200) {\n' +
            '        document.getElementById("demo").innerHTML = this.responseText;\n' +
            '    }\n' +
            '};')[1].line),1
    );
};


const test12 = () => {
    assert.equal(
        JSON.stringify(extractBody('if (x > 2){x = 2}else{x = 5}')[1].line),1
    );
};

describe('ALL TESTS', () => {

    it('Test 1:', test1);
    it('Test 2:', test2);
    it('Test 3:', test3);
    it('Test 4:', test4);
    it('Test 5:', test5);
    it('Test 6:', test6);
    it('Test 7:', test7);
    it('Test 8:', test8);
    it('Test 9:', test9);
    it('Test 10:',test10);
    it('Test 11:',test11);
    it('Test 12:',test12);



});



