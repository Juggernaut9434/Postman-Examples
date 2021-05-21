/*
 * Author:  Michael Mathews
 * Date:    May 2021
 * Testing for json property response, verify post body
 * and cookies verification. 
 * Copyright (c) <DATE> Michael Mathews
 */

// Receive a 200 status
pm.test("Status Test", () => {
    pm.response.to.have.status(200);
    if(pm.response.status != "OK")
        throw new Error('Failed 200 Status');
});

// Make sure the Body is Sent with the correct Attributes
pm.test('Request Body', () => {
    const body = pm.request.body.formdata.toObject(true);
    pm.expect(body).to.have.property('email');
    pm.expect(body).to.have.property('password');
});

let response = pm.response.json();
// verify that we have the correct attributes in response
pm.test('token.active', () => {               
	pm.expect(response.token.active).to.eql('michaelmathews@nugistics.io');
});
pm.test('token.code', () => {               
	pm.expect(response.token.code).to.eql('e957df8112174e20a0b236f7d01af138');
});
pm.test('token.lastlogin', () => {               
	pm.expect(response.token.lastlogin).to.exist;
});
pm.test('token.name', () => {               
	pm.expect(response.token.name).to.eql('Michael Mathews');
});
pm.test('token.site', () => {               
	pm.expect(response.token.site).to.eql(37);
});

// negative case
pm.test('token.bunnies', () => {
    pm.expect(response.token.bunnies).to.not.exist;
});

// Verify that cookies are generated
// we can put these in the cookie jar if we wanted
pm.test('Cookies Generated', () => {
    pm.expect(pm.cookies.has('ARRAffinity')).to.be.true;
    pm.expect(pm.cookies.has('ARRAffinitySameSite')).to.be.true;

    // negative case
    pm.expect(pm.cookies.has('bunnies')).to.be.false;
});
