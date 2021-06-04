// 
// Author:  Michael Mathews
// Date:    May 2021
// Execute: in node.js
// Copyright (c) <YEAR> Michael Mathews
//

// pull json data from file
const data = require('./example.json');


// Returns boolean if it is a Date according to Javascript
// when given ["helloString", 1, "1", "2012-04-23T18:25:43.511Z", "01/01/1999"]
// it returns   F, F,  F,  T,  T
const isDate = (s) => isNaN(Number(s).toString()) 
    && !isNaN(Date.parse(s)) 
    && !isNaN(Number(Date.parse(s)).toString());


// from https://codegolf.stackexchange.com/a/195480
// returns list of jsonPaths
let f=o=>Object.keys(o+''===o||o||0).flatMap(k=>[k,...f(o[k]).map(i=>k+'.'+i)]);

// changes "this.cant.0.be.hard" to "this.cant[0].be.hard"
function fix_f(json){
    let array = f(json);
    let v = [];

    // for each element in Path Array.
    for(const element of array)
    {
        // divide single Path into pieces
        // ex: ["this", "cant", "0", "be", "hard"]
        let ar = element.split('.');
        let newString = [];

        for(const addr of ar)
        {
                // If its a number, add brackets, otherwise add a dot.
                Number(addr).toString() != "NaN" ? newString.push(`[${addr}]`) : newString.push(`.${addr}`);
        }

        // add to the array of new Paths
        v.push(newString.join(''));
    }
    return v;
}

// for a collective test on attributes
// exist(json)
// returns string of pm test line
function exist(json) { 
    let strArr = [];
    let list = fix_f(json);
    
    // loop over all the Paths
    for(const element of list)
    {
        // value from keyPath
        let result = eval(`json${element}`);
        

        if(typeof(result) == "object" && result != null) 
        {
            element.startsWith('[') ? 
                strArr.push(`pm.expect(response${element}).to.exist;`) : 
                strArr.push(`pm.expect(response.${element}).to.exist;`);
        } 

        // if result is null and not a child
        else if(`${element}`.split('.').length == 1)
        {
            strArr.push(`pm.expect(response${element}).to.exist;`);
        }
        
        // if otherwise
        else
        {
            // split the path into pieces by .
            let s = `${element}`.split('.');
            // put all except the last back together
            let first = s.slice(0, s.length-1).join('.');
            let last = s[s.length-1];

                    // if result is null and not a child
            if(`${element}`.split('.').length == 2)
            {
                // fix a previous bug so its not printed "--(response.).to--"
                element.startsWith('[') ? 
                    strArr.push(`pm.expect(response${first}).to.have.property('${last}');`) :
                    strArr.push(`pm.expect(response).to.have.property('${element}');`);
            }
            else
            {

                // make the test
                element.startsWith('[') ? 
                    strArr.push(`pm.expect(response${first}).to.have.property('${last}');`):
                    strArr.push(`pm.expect(response.${first}).to.have.property('${last}');`);
            }
        } 
    } // out of for loop
    return strArr;
}

// for separate tests
// exist_test(json)
// return string of pm test for key exist
function exist_test(json) { 
    let testArr = [];
    let list = exist(json);
    let paths = fix_f(json);
    
    // loop over all the Paths
    list.forEach( (str, index) => {
        testArr.push(`pm.test("${paths[index]}", () => {\n\t${str}\n});`)
    });
    return testArr;
}

// valueTest(json);
// string pm tests for each key value pair
function value_test(json) {
    let strArr = [];
    let k = fix_f(json);      // key
    for(let i=0;i<k.length;i++)
    {
        let v = eval(`json${k[i]}`);
        // split the path into pieces by .
        let s = `${k[i]}`.split('.');
        // put all except the last back together
        let first = s.slice(0, s.length-1).join('.');
        let last = s[s.length-1];

        // if no children, remove the extra dot.
        if(k[i].split('.').length == 1 && (v == null || typeof(v) == "object" || isDate(v)))
        {
                // make the test
                k[i].startsWith('[') ? 
                    strArr.push(`pm.test('${k[i]}', () => {\
                        \n\tpm.expect(response${k[i]}).to.exist;\n});`):
                    strArr.push(`pm.test('${k[i]}', () => {\
                        \n\tpm.expect(response).to.have.property('${k[i]}');\n});`);
        }

        // if result is null or object or date
        else if(v == null || typeof(v) == "object" || isDate(v))
        {
            // make the test
            k[i].startsWith('[') ? 
                strArr.push(`pm.test('${k[i]}', () => {\
                    \n\tpm.expect(response${first}).to.have.property('${last}');\n});`):
                strArr.push(`pm.test('${k[i]}', () => {\
                    \n\tpm.expect(response.${first}).to.have.property('${last}');\n});`);
        }
        // if the value is not a String, remove the quotations
        else if(Number(v[i]).toString() != "NaN")
        {
            k[i].startsWith('[') ?
                strArr.push(`pm.test('${k[i]}', () => {\
                    \n\tpm.expect(response${first}).to.have.property('${last}', ${v});\n});`):
                strArr.push(`pm.test('${k[i]}', () => {\
                    \n\tpm.expect(response.${first}).to.have.property('${last}', ${v});\n});`);
        }
        else
        {
            k[i].startsWith('[') ?
                strArr.push(`pm.test('${k[i]}', () => {\
                    \n\tpm.expect(response${first}).to.have.property('${last}', '${v}');\n});`):
                strArr.push(`pm.test('${k[i]}', () => {\
                \n\tpm.expect(response.${first}).to.have.property('${last}', '${v}');\n});`);
        }
    }
    return strArr;
}

// use case examples
//const et = exist_test(data);
//et.forEach( (str) => { console.log(str); });
//const vt = value_test(data);
//vt.forEach( (str) => { console.log(str); });

// exports
module.exports = {exist_test, value_test};
