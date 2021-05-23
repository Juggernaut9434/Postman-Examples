// 
// Author:  Michael Mathews
// Date:    May 2021
// Execute: in node.js
// Copyright (c) <YEAR> Michael Mathews
//

// example json object to use.
const testjson = {
    "test": null,
    "driver": [
        {
            "id": 0,
            "button": true,
            "calendar": null,
            "color": "blue"
        },
        {
            "id": 1,
            "button": false,
            "calendar": null,
            "color": "red"
        }
    ],
    "glossary": {
        "title": "example glossary",
        "GlossDiv": {
            "title": "S",
            "GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
                    "SortAs": "SGML",
                    "GlossTerm": "Standard Generalized Markup Language",
                    "Acronym": "SGML",
                    "Abbrev": "ISO 8879:1986",
                    "GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
                        "GlossSeeAlso": ["GML", "XML"]
                    },
                    "GlossSee": "markup"
                }
            }
        }
    }
};


// from https://codegolf.stackexchange.com/a/195480
// returns list of jsonPaths
let f=o=>Object.keys(o+''===o||o||0).flatMap(k=>[k,...f(o[k]).map(i=>k+'.'+i)]);

// changes "this.cant.0.be.hard" to "this.cant[0].be.hard"
function fix_f(array){
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
        v.push(newString.join('').substring(1));
    }
    return v;
}

// for a collective test on attributes
// exist(json)
// returns string of pm test line
function exist(json) { 
    let strArr = [];
    let list = fix_f(f(json));
    
    // loop over all the Paths
    for(const element of list)
    {
        // value from keyPath
        let result = eval(`json.${element}`);
        
        // if result is null and not a child
        if(result == null && `json.${element}`.split('.').length == 2)
        {
            // fix a previous bug so its not printed "--(response.).to--"
            strArr.push(`pm.expect(response).to.have.property('${element}');`);
        }
        
        // if value is null, check if key exists only
        else if(result == null)
        {
            // split the path into pieces by .
            let s = `${element}`.split('.');
            // put all except the last back together
            let first = s.slice(0, s.length-1).join('.');
            let last = s[s.length-1];

            // make the test
            strArr.push(`pm.expect(response.${first}).to.have.property('${last}');`);
        } 
        else {
            // make the test
            strArr.push(`pm.expect(response.${element}).to.exist;`);
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
    let paths = fix_f(f(json));
    
    // loop over all the Paths
    list.forEach( (str, index) => {
        testArr.push(`pm.test("${paths[index]}", () => {\n\t${str}\n});`)
    });
    return testArr;
}

// valuesToArray(json);
// returns array of values from the k-keys.
function valuesToArray(obj) {

    // find all the keys that have direct values
    let k = fix_f(f(obj));
    let v = [];

    // build a new string
    let evaled = '';
    for(const key of k) {
        // break it down for some reason
        let str = 'obj'.concat('.', key);
        // definite resolution of evaled as String
        evaled = eval(str, String);
        // add evaled to array of Values.
        v.push(evaled);
    }
    return v;
}

// valueTest(json);
// string pm tests for each key value pair
function value_test(obj) {
    let strArr = [];
    let k = fix_f(f(obj));
    let v = valuesToArray(obj);
    for(let i=0;i<k.length;i++)
    {
        // if result is null
        if(v[i] == null || typeof(v[i]) == "object")
        {
            // split the path into pieces by .
            let s = `${k[i]}`.split('.');
            // put all except the last back together
            let first = s.slice(0, s.length-1).join('.');
            let last = s[s.length-1];

            // make the test
            strArr.push(`pm.test('${k[i]}', () => {\
                \n\tpm.expect(response.${first}).to.have.property('${last}');\n});`);
        }
        // if the value is not a String, remove the quotations
        else if(Number(v[i]).toString() != "NaN")
            strArr.push(`pm.test('${k[i]}', () => {\
                \n\tpm.expect(obj.(${k[i]}).to.eql(${v[i]});\n});`);
        else
            strArr.push(`pm.test('${k[i]}', () => {\
               \n\tpm.expect(obj.${k[i]}).to.eql('${v[i]}');\n});`);
    }
    return strArr;
}

// use case examples
//const et = exist_test(testjson);
//et.forEach( (str) => { console.log(str); });
//const vt = value_test(testjson);
//vt.forEach( (str) => { console.log(str); });

// exports
module.exports = {exist_test, value_test};
