# Newman NPM Script

The abstract view of it is best
described as running newman
as a node package 
then passing in environment 
variables from the script command
which are parsed in by command line.

It is important to keep the literals
in **single quotes** and variable strings
in __**double quotes**__. 

example on the cli

```shell
npm run pm:run-tests --username='hello'
```

This is made as a template and __not__ to be 
copy pasted and downloaded.

## Required files

- package.json
- newman-script.js
- myCollection.postman_collection.json

## package.json

The `USERNAME=...` is a node environment being set.
You can name it whatever and ideally in all CAPS.

```json
	"scripts": {
		"pm:run-tests": "cross-env USERNAME=$npm_config_username node newman-script.js"
	}
```

where the cli value of `--username` is placed in for `$npm_config_username`.

## newman-script.js

below shows the script which has newman as a node package.
Given a default postman_environment.json that has username
which is then rewritten to the environment.

We then run the postman collection that has tests in it.
Most likely want to set `bail: false` in your tests
unless you want it to stop when a single test fails.


```javascript

const newman = require('newman'); // require newman in your project

var json = {
	"id": "463d70e7-7c5a-4b8c-9395-e1dc7a4a2d5f",
	"name": "myTemplate",
	"values": [
		{
			"key": "username",
			"value": "EXAMPLE_EMAIL",
			"enabled": true
		},
		{
			"key": "site",
			"value": "www.google.com/"
			"enabled": false
		}
	],
	"_postman_variable_scope": "environment",
	"_postman_exported_at": "2021-05-24T00:03:22.915Z",
	"_postman_exported_using": "Postman/8.5.1"
};

json.values[0].value = process.env.USERNAME;
console.log(json);
// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./myCollection.postman_collection.json'),
    environment: json,
    reporters: 'cli',
	bail: true
}, function (err) {
	if (err) { throw err; }
    console.log('collection run complete!');
});
```
