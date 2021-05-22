/* 
 * Author:  Michael Mathews
 * Date:    May 2021
 * Execute: in node.js
 * Copyright (c) <DATE> Michael Mathews
 */

// example json object to use.
const json = {
    "test": null,
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
let f=o=>Object.keys(o+''===o||o||0).flatMap(k=>[k,...f(o[k]).map(i=>k+'.'+i)]);

// changes "this.cant.0.be.hard" to "this.cant[0].be.hard"
function fix_f(array){
    let v = []
    for(let i=0;i<array.length;i++)
    {
        let ar = array[i].split('.');
        let newString = '';
        for(let j=0;j<ar.length;j++)
        {
            Number(ar[j]).toString() != "NaN" ? newString += `[${ar[j]}]` : newString += '.' + ar[j];
        }
        v.push(newString.substring(1));
    }
    return v;
}

// for a collective test on attributes
// exist(json)
// prints assertion of pm test for key exist.
const exist = (json) => { 
    let list = fix_f(f(json));
    for(let i=0;i<list.length;i++)
    {
        console.log(`pm.expect(obj.${list[i]}).to.exist;\n`);
    }
}

// for separate tests
// exist_test(json)
// prints pm test for key exist
const exist_test = (json) => { 
    let list = fix_f(f(json));
    
    // loop over all the Paths
    for(let i=0;i<list.length;i++)
    {
        // value from keyPath
        let result = eval(`json.${list[i]}`);
        
        // if result is null and not a child
        if(result == null && `json.${list[i]}`.split('.').length == 2)
        {
            // fix a previous bug so its not printed "--(response.).to--"
            console.log(`pm.test('${list[i]}', () => {\
                \n\tpm.expect(response).to.have.property('${list[i]}');\n});`);
        }
        
        // if value is null, check if key exists only
        else if(result == null)
        {
            // split the path into pieces by .
            let s = `${list[i]}`.split('.');
            // put all except the last back together
            let first = s.slice(0, s.length-1).join('.');
            let last = s[s.length-1];
            console.log(`pm.test('${list[i]}', () => {\
                \n\tpm.expect(response.${first}).to.have.property('${last}');\n});`);
        } 
        else {
            console.log(`pm.test('${list[i]}', () => {\
                \n\tpm.expect(response.${list[i]}).to.exist;\n});`);
        }
    }
}


// another solution, from https://stackoverflow.com/a/53620876
// propertiesToArray(json);
// returns full paths from a json object
function propertiesToArray(obj) {
    const isObject = val =>
        typeof val === 'object' && !Array.isArray(val);

    const addDelimiter = (a, b) =>
        a ? `${a}.${b}` : b;

    const paths = (obj = {}, head = '') => {
        return Object.entries(obj)
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
    let name = Object.keys({obj})[0];
    let k = propertiesToArray(obj);
    let v = [];
    let evaled = '';
    for(let i=0;i<k.length;i++) {
        let str = name.concat('.', k[i]);
        evaled = eval(str, String);
        v.push(evaled);
    }
    return v;
}

// valueTest(json);
// prints pm tests for each key value pair
const valueTest = (obj) => {
    let name = Object.keys({obj})[0];
    let k = propertiesToArray(obj);
    let v = valuesToArray(obj, name);
    for(let i=0;i<k.length;i++)
    {
        if(Number(v[i]).toString() != "NaN")
            console.log(`pm.test('${k[i]}', () => {\
                \n\tpm.expect${name}.(${k[i]}).to.eql(${v[i]});\n});`);
        else
            console.log(`pm.test('${k[i]}', () => {\
               \n\tpm.expect(${name}.${k[i]}).to.eql('${v[i]}');\n});`);
    }
}

//exist_test(json);
//valueTest(json);
