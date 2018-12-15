import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
export {codeSubstituter};

// --------------- GLOBALS DUH------------------

let argsAsCodeText;
let argsMap;
let coloredLinesOrder;

// --------------- TOP LEVEL FUNCTION ------------------

const codeSubstituter = (inputArgs, codeToSubstitute) => {

    argsHandler(inputArgs);
    let JsonExp = esprima.parseScript(codeToSubstitute);
    let JExpBody = JsonExp.body;

    coloredLinesOrder = [];

    functionHandler(JExpBody);
    let subbedCode = escodegen.generate(JsonExp);

    let toPrint = setLineColors(subbedCode);
    return toPrint;
};

// -------------------- HANDLERS -----------------------

const _handler_FunctionDeceleration = (JExp, symTable) => {
    _handler_BlockStatement(JExp.body, symTable);
};

const _handler_BlockStatement = (JExp, symTable) => {
    for (let i = 0; i < JExp.body.length; i++) {
        JExpHandler[JExp.body[i].type](JExp.body[i], symTable);
    }
    JExp.body = clearRedundantLines(JExp.body);
};

const _handler_VariableDeclaration = (JExp, symTable) => {
    let variableName = JExp.declarations[0].id.name;
    let value = JExp.declarations[0].init;

    symTable[0].push(variableName);
    symTable[1].push(value == null ? value : JExpHandler[value.type](value, symTable));
};

const _handler_AssignmentExpressionRightSide = (JExp, symTable) => {
    return JExpHandler[JExp.type](JExp, symTable);
};

const _handler_ExpressionStatement = (JExp, symTable) => {
    JExpHandler[JExp.expression.type](JExp.expression, symTable);
};

const _handler_AssignmentExpression = (JExp, symTable) => {
    let rhsToParse = JExpHandler['AssignmentExpressionRightSide'](JExp.right, symTable);
    JExp.right = esprima.parseScript(rhsToParse).body[0].expression;
    updateSymTable(JExp, symTable);
};

const _handler_WhileStatement = (JExp, symTable) => {
    let testToParse = JExpHandler[JExp.test.type](JExp.test, symTable);
    JExp.test = esprima.parseScript(testToParse).body[0].expression;
    JExpHandler[JExp.body.type](JExp.body, copySymTable(symTable));
};

const _handler_IfStatement = (JExp, symTable) => {
    let testToParse = JExpHandler[JExp.test.type](JExp.test, symTable);
    JExp.test = esprima.parseScript(testToParse).body[0].expression;

    let testResult = evalAll(testToParse);
    _handler_LineColor(testResult);

    let ifSymTable = copySymTable(symTable);
    JExpHandler[JExp.consequent.type](JExp.consequent, ifSymTable);

    _handler_IfStatementBody(JExp, testResult, ifSymTable, symTable);
};

const _handler_IfStatementBody = (JExp, testResult, ifSymTable, symTable) => {

    if (JExp.alternate != null && testResult === false) {
        let elseSymTable = copySymTable(symTable);
        JExpHandler[JExp.alternate.type](JExp.alternate, elseSymTable);
        symTable[0] = elseSymTable[0];
        symTable[1] = elseSymTable[1];
    }

    if (JExp.alternate != null) {
        JExpHandler[JExp.alternate.type](JExp.alternate, copySymTable(symTable));
    }
    if (testResult === true) {
        symTable[0] = ifSymTable[0];
        symTable[1] = ifSymTable[1];
    }
};

const _handler_ReturnStatement = (JExp, symTable) => {
    let parsedJExp = esprima.parseScript(JExpHandler[JExp.argument.type](JExp.argument, symTable));
    JExp.argument = parsedJExp.body[0].expression;
};

const _handler_BinaryExpression = (JExp, symTable) => {
    let lhs = JExpHandler[JExp.left.type](JExp.left, symTable);
    let rhs = JExpHandler[JExp.right.type](JExp.right, symTable);

    // if (JExp.operator === '*' || JExp.operator === '/') {
    //     if (lhs.length >= 2) lhs = '(' + lhs + ')';
    //     if (rhs.length >= 2) rhs = '(' + rhs + ')';
    // }
    return lhs + JExp.operator + rhs;
};

const _handler_LiteralExpression = (JExp) => {
    return JExp.raw;
};

const _handler_IdentifierExpression = (JExp, symTable) => {
    let index = symTable[0].lastIndexOf(JExp.name);
    if (index < 0) return JExp.name;
    else return symTable[1][index];
};

const JExpHandler = {
    'AssignmentExpression': _handler_AssignmentExpression,
    'AssignmentExpressionRightSide': _handler_AssignmentExpressionRightSide,
    'BinaryExpression': _handler_BinaryExpression,
    'BlockStatement': _handler_BlockStatement,
    'ExpressionStatement': _handler_ExpressionStatement,
    'FunctionDeclaration': _handler_FunctionDeceleration,
    'Identifier': _handler_IdentifierExpression,
    'IfStatement': _handler_IfStatement,
    'Literal': _handler_LiteralExpression,
    'ReturnStatement': _handler_ReturnStatement,
    'VariableDeclaration': _handler_VariableDeclaration,
    'WhileStatement': _handler_WhileStatement,
};


// ------------------- HELPERS ----------------------

const functionHandler = (JExpBody) => {
    let JExp;
    for (let i = 0; i < JExpBody.length; i++) {
        JExp = JExpBody[i];
        JExpHandler[JExp.type](JExp, [[], []]);
    }
};

const argsHandler = (inputArgs) => {
    argsMap = new Map();
    argsAsCodeText = '';
    let rawArgsMap = (esprima.parseScript(inputArgs)).body[0].expression.expressions;
    let variable;
    let value;

    for (let i = 0; i < rawArgsMap.length; i++) {
        variable = rawArgsMap[i].left.name;
        value = rawArgsMap[i].right.raw;
        argsMap.set(variable, value);
        argsAsCodeText = argsAsCodeText.concat('let ' + variable + ' = ' + value + '\n');
    }
};

const _handler_LineColor = (testResult) => {
    coloredLinesOrder.push(testResult ? 'green' : 'red');
};

const setLineColors = (subbedCode) => {
    subbedCode = subbedCode.split('\n');
    let i = 0;
    for (let j = 0; j < subbedCode.length; j++) {
        if (subbedCode[j].indexOf('if') !== -1)
            subbedCode[j] = '<LnClr_' + coloredLinesOrder[i] + '>' + subbedCode[j] + '</LnClr_' + coloredLinesOrder[i++] + '>';
    }
    return subbedCode.join('\n');
};

const clearRedundantLines = (JExpBody) => {

    JExpBody = clearVarDecInCode(JExpBody);
    JExpBody = clearAssignExp(JExpBody);

    return JExpBody;
};

const clearVarDecInCode = (JExpBody) => {
    return JExpBody.filter((exp) => {
        return (!(exp.type === 'VariableDeclaration'));
    });
};

const clearAssignExp = (JExpBody) => {
    return JExpBody.filter((exp) => {
        return (!(exp.type === 'ExpressionStatement') ||
            !(exp.expression.type === 'AssignmentExpression') ||
            isInArgsMap((exp.expression.left))
        );
    });
};

const evalAll = (codeToEval) => {
    return eval(argsAsCodeText + codeToEval);
};

function isInArgsMap(exp) {
    return (exp.type === 'Identifier' && argsMap.has(exp.name));
}

const copySymTable = (symTable) => {
    let vals = symTable[0].slice();
    let vars = symTable[1].slice();

    return [vals, vars];
};

const updateSymTable = (JExp, symTable) => {
    symTable[1].push(JExpHandler['AssignmentExpressionRightSide'](JExp.right, symTable));
    symTable[0].push(JExp.left.name);
};