import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

//********************************************************************//

const _parser_FunctionDeceleration = (funcDec) => {

    let line = funcDec.loc.start.line;
    let type = funcDec.type;
    let name = funcDec.id.name;
    let condition = '';
    let value = '';
    let arr = [{line: line, type:type, name:name, condition: condition, value:value}];

    for (let i = 0 ; i < (funcDec.params).length; i++ ){
        let line = funcDec.params[i].loc.start.line;
        let type = 'VariableDeclaration';
        let name = funcDec.params[i].name;
        let condition = '';
        let value = '';
        arr = arr.concat([{line:line, type:type, name:name, condition: condition, value:value}]);
    }
    arr = arr.concat(_parser_body(funcDec.body.body));
    return arr;
};

const _parser_ExpressionStatement = (expSt) => {

    //if(expSt.expression.type != 'AssignmentExpression') return [];

    let line = expSt.loc.start.line;
    let type = expSt.expression.type;
    let name = escodegen.generate(expSt.expression.left);
    let condition = '';
    let value = escodegen.generate(expSt.expression.right);

    return [{line:line, type:type, name:name, condition: condition, value:value}];
};

const _parser_WhileStatement = (whileSt) => {

    let line = whileSt.loc.start.line;
    let type = whileSt.type;
    let name = '';
    let condition = escodegen.generate(whileSt.test);
    let value = '';

    let arr = [{line:line, type:type, name:name, condition: condition, value:value}];

    var body;
    if (whileSt.body.type == 'BlockStatement'){body = whileSt.body.body;}
    else{body = [whileSt.body];}

    arr = arr.concat(_parser_body(body));

    return arr;
};

const _parser_ForStatement = (forSt) => {

    let line = forSt.loc.start.line;
    let type = forSt.type;
    let name = '';
    let condition = escodegen.generate(forSt.test);
    let value = '';

    let arr = [{line:line, type:type, name:name, condition: condition, value:value}];

    arr = arr.concat(_parser_body([forSt.body]));

    return arr;
};

const _parser_ReturnStatement = (retSt) => {

    let line = retSt.loc.start.line;
    let type = retSt.type;
    let name = '';
    let condition = '';
    let value =  escodegen.generate(retSt.argument);

    return [{line:line, type:type, name:name, condition: condition, value:value}];
};

const _parser_IfStatement = (ifSt) => {
    let line = ifSt.loc.start.line;
    let type = ifSt.type;
    let name = '';
    let condition = escodegen.generate(ifSt.test);
    let value =  '';
    let arr = [{line:line, type:type, name:name, condition: condition, value:value}];
    arr = arr.concat(_parser_body([ifSt.consequent]));
    if (ifSt.alternate != null && ifSt.alternate.type == 'IfStatement'){
        arr = arr.concat(_parser_IfElse(ifSt.alternate));
    }
    else {
        arr = arr.concat(_parser_body([ifSt.alternate]));
    }
    return arr;
};

const _parser_VariableDeclarationStatement = (varDecSt) => {
    let arr = [];
    for (let i = 0; i < (varDecSt.declarations).length; i++){

        let line = varDecSt.declarations[i].loc.start.line;
        let type = 'VariableDeclaration';
        let name = varDecSt.declarations[i].id.name;
        let condition = '';
        let value =  '';

        arr = arr.concat([{line:line, type:type, name:name, condition: condition, value:value}]);
    }
    return arr;
};

const _parser_IfElse = (ifSt) => {

    let line = ifSt.loc.start.line;
    let type = 'ElseIfStatement';
    let name = '';
    let value =  '';
    let condition = escodegen.generate(ifSt.test);
    let arr = [{line:line, type:type, name:name, condition: condition, value:value}];
    arr = arr.concat(_parser_body([ifSt.consequent]));

    if (ifSt.alternate.type == 'IfStatement'){
        arr = arr.concat(_parser_IfElse(ifSt.alternate));
    }
    else {
        arr = arr.concat(_parser_body(ifSt.alternate));
    }
    return arr;
};

//*********************************************************************//

const extractBody = (codeToParse) => {

    let parsedCode =  esprima.parseScript(codeToParse, { loc : true });
    let arr = [{line:'Line', type:'Type', name:'Name', condition: 'Condition', value:'Value'}];
    arr = arr.concat(_parser_body(parsedCode.body));
    return arr;

};

const _parser_body = (JExpBody) => {
    let arr =[];
    for (let i = 0; i < JExpBody.length ; i++) {
        //if (JExpBody[i] == null) continue;
        switch (JExpBody[i].type) {
        case 'FunctionDeclaration': arr = arr.concat(_parser_FunctionDeceleration(JExpBody[i])); break;
        case 'WhileStatement': arr = arr.concat(_parser_WhileStatement(JExpBody[i])); break;
        default: arr = arr.concat(_parser_body_helper(JExpBody[i])); break;
        }}
    return arr;
};

const _parser_body_helper = (JExpBody) => {
    let arr =[];
    switch (JExpBody.type) {
    case 'IfStatement': arr = arr.concat(_parser_IfStatement(JExpBody)); break;
    case 'ForStatement': arr = arr.concat(_parser_ForStatement(JExpBody)); break;
    case 'VariableDeclaration': arr = arr.concat(_parser_VariableDeclarationStatement(JExpBody)); break;
    default: arr = arr.concat(_parser_body_helper2(JExpBody)); break;
    }
    return arr;
};

const _parser_body_helper2 = (JExpBody) => {
    let arr =[];
    switch (JExpBody.type) {
    case 'ReturnStatement': arr = arr.concat(_parser_ReturnStatement(JExpBody)); break;
    case 'ExpressionStatement': arr = arr.concat(_parser_ExpressionStatement(JExpBody)); break;
    case 'BlockStatement': arr = arr.concat(_parser_body(JExpBody.body)); break;

    default: break;
    }
    return arr;
};

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, { loc : true });

};

export {parseCode, extractBody};
