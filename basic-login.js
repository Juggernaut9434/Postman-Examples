/*
 * Author:  Michael Mathews
 * Date:    May 2021
 * Testing for json property response, verify post body
 * and cookies verification. 
 */

// Receive a 200 status
pm.test("Status Test", () => {
    pm.response.to.have.status(200);
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
    pm.expect(responseJSON).to.have.property('active');
    pm.expect(responseJSON).to.have.property('code');
    pm.expect(responseJSON).to.have.property('lastlogin');
    pm.expect(responseJSON).to.have.property('name');
    pm.expect(responseJSON).to.have.property('site');
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
