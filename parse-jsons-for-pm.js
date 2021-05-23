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
// prints assertion of pm test for key exist.
const exist = (json) => { 
    let list = fix_f(f(json));
    for(const element of list)
    {
        console.log(`pm.expect(obj.${element}).to.exist;\n`);
    }
}

// for separate tests
// exist_test(json)
// prints pm test for key exist
const exist_test = (json) => { 
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
            console.log(`pm.test('${element}', () => {\
                \n\tpm.expect(response).to.have.property('${element}');\n});`);
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
            console.log(`pm.test('${element}', () => {\
                \n\tpm.expect(response.${first}).to.have.property('${last}');\n});`);
        } 
        else {
            // make the test
            console.log(`pm.test('${element}', () => {\
                \n\tpm.expect(response.${element}).to.exist;\n});`);
        }
    }
}


// from https://stackoverflow.com/a/53620876
// returns full paths from a json object that has values.
// propertiesToArray(json);
function propertiesToArray(obj) {
    const isObject = val =>
        typeof val === 'object' && !Array.isArray(val);

    const addDelimiter = (a, b) =>
        a ? `${a}.${b}` : b;

    const paths = (obj2 = {}, head = '') => {
        return Object.entries(obj2)
            .reduce((product, [key, value]) => 
                {
                    let fullPath = addDelimiter(head, key)
                    return isObject(value) ?
                        product.concat(paths(value, fullPath))
                    : product.concat(fullPath)
                }, []);
    }

    return paths(obj);
}

// valuesToArray(json);
// returns array of values from the k-keys.
function valuesToArray(obj) {

    // find all the keys that have direct values
    let k = propertiesToArray(obj);
    let v = [];

    // build a new string
    let evaled = '';
    for(const key of k) {
        // break it down for some reason
        let str = 'name'.concat('.', key);
        // definite resolution of evaled as String
        evaled = eval(str, String);
        // add evaled to array of Values.
        v.push(evaled);
    }
    return v;
}

// valueTest(json);
// prints pm tests for each key value pair
const valueTest = (obj) => {
    let k = propertiesToArray(obj);
    let v = valuesToArray(obj);
    for(let i=0;i<k.length;i++)
    {
        // if the value is not a String, remove the quotations
        if(Number(v[i]).toString() != "NaN")
            console.log(`pm.test('${k[i]}', () => {\
                \n\tpm.expect(obj.(${k[i]}).to.eql(${v[i]});\n});`);
        else
            console.log(`pm.test('${k[i]}', () => {\
               \n\tpm.expect(obj.${k[i]}).to.eql('${v[i]}');\n});`);
    }
}

exist_test(testjson);
//valueTest(testjson);
