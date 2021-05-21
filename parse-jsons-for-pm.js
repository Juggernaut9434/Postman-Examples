// Michael Mathews
// May 2021
// Execute: in node.js


const json = {
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

let list = f(json);

// for a collective test on attributes
// e()
const e = () => { 
    for(let i=0;i<list.length;i++)
    console.log(`pm.expect(${list[i]}).to.exist;\n`);
}

// for separate tests
// t();
const t = () => { for(let i=0;i<list.length;i++)
    {
        console.log(`pm.test('${list[i]}', () => {\
            \n\tpm.expect(${list[i]}).to.exist;\n});`);
    }
}

// another solution
// propertiesToArray(json);
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

// valuesToArray(json, 'json');
function valuesToArray(obj, name='myj') {
    let k = propertiesToArray(obj);
    let v = []
    let evaled = '';
    for(let i=0;i<k.length;i++) {
        let str = name.concat('.', k[i]);
        evaled = eval(str, String);
        v.push(evaled);
    }
    return v;
}

// valueTest(json, 'json');
const valueTest = (obj, name) => {
    let k = propertiesToArray(obj);
    let v = valuesToArray(obj, name);
    for(let i=0;i<k.length;i++)
    {
        if(Number(v[i]).toString() != "NaN")
            console.log(`pm.test('${k[i]}', () => {\
                \n\tpm.expect(${k[i]}).to.eql(${v[i]});\n});`);
        else
            console.log(`pm.test('${k[i]}', () => {\
               \n\tpm.expect(${k[i]}).to.eql('${v[i]}');\n});`);
    }
}
