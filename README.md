# Postman-Examples

Postman Test Examples for reference
and usage

This is a collection of both examples of Postman test scripts
and scripts that make writing these tests faster.

If you have a json object that you need to validate,
use `parse-jsons-for-pm.js` that has functions
for validating key's existing or key value validation.

### ParseJsonsForPM

This is to parse a json object and print to console
postman tests.
At the bottom of this file there is an example of execution.

`exist_test(obj)` and `value_test(obj)` are both exported
for general use.
