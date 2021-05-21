/*
 * Author:  Michael Mathews
 * Date:    May 2021
 * Testing for json property response, verify post body
 * and cookies verification. 
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

// verify that we have the correct attributes in response
pm.test('Response Attributes', () => {
   const responseJSON = pm.response.json().token;
    pm.expect(responseJSON.active).to.exist;
    pm.expect(responseJSON.code).to.exist;
    pm.expect(responseJSON.lastlogin).to.exist;
    pm.expect(responseJSON.name).to.exist;
    pm.expect(responseJSON.site).to.exist;
    // negative case
    pm.expect(responseJSON).to.not.have.property('bunnies');
});

// Verify that cookies are generated
// we can put these in the cookie jar if we wanted
pm.test('Cookies Generated', () => {
    pm.expect(pm.cookies.has('ARRAffinity')).to.be.true;
    pm.expect(pm.cookies.has('ARRAffinitySameSite')).to.be.true;

    // negative case
    pm.expect(pm.cookies.has('bunnies')).to.be.false;
});
