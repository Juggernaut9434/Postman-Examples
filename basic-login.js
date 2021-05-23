//
// Author:  Michael Mathews
// Date:    May 2021
// Testing for json property response, verify post body
// and cookies verification. 
// Copyright (c) <DATE> Michael Mathews
//

var response;

// Receive a 200 status
pm.test("Status Test", () => {
    pm.response.to.have.status(200);
    if(pm.response.status != "OK")
        throw new Error('Failed 200 Status');
});

pm.test("JSON Body", () => {
    pm.response.to.be.withBody;
    pm.response.to.be.json;
});

// Make sure the Body is Sent with the correct Attributes
pm.test('Request Body', () => {
    const body = pm.request.body.formdata.toObject(true);
    pm.expect(body).to.have.property('email');
    pm.expect(body).to.have.property('password');
});

pm.test('test', () => {                    
	pm.expect(response).to.have.property('test');
});
pm.test('driver', () => {                    
	pm.expect(response).to.have.property('driver');
});
pm.test('driver[0]', () => {                    
	pm.expect(response).to.have.property('driver[0]');
});
pm.test('driver[0].id', () => {                
	pm.expect(response.driver[0].id).to.eql(0);
});
pm.test('driver[0].button', () => {                
	pm.expect(response.driver[0].button).to.eql(true);
});
pm.test('driver[0].calendar', () => {                    
	pm.expect(response.driver[0]).to.have.property('calendar');
});
pm.test('driver[0].color', () => {               
	pm.expect(response.driver[0].color).to.eql('blue');
});
pm.test('driver[1]', () => {                    
	pm.expect(response).to.have.property('driver[1]');
});
pm.test('driver[1].id', () => {                
	pm.expect(response.driver[1].id).to.eql(1);
});
pm.test('driver[1].button', () => {                
	pm.expect(response.driver[1].button).to.eql(false);
});
pm.test('driver[1].calendar', () => {                    
	pm.expect(response.driver[1]).to.have.property('calendar');
});
pm.test('driver[1].color', () => {               
	pm.expect(response.driver[1].color).to.eql('red');
});
pm.test('glossary', () => {                    
	pm.expect(response).to.have.property('glossary');
});
pm.test('glossary.title', () => {               
	pm.expect(response.glossary.title).to.eql('example glossary');
});
pm.test('glossary.GlossDiv', () => {                    
	pm.expect(response.glossary).to.have.property('GlossDiv');
});
pm.test('glossary.GlossDiv.title', () => {               
	pm.expect(response.glossary.GlossDiv.title).to.eql('S');
});
pm.test('glossary.GlossDiv.GlossList', () => {                    
	pm.expect(response.glossary.GlossDiv).to.have.property('GlossList');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry', () => {                    
	pm.expect(response.glossary.GlossDiv.GlossList).to.have.property('GlossEntry');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.ID', () => {               
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.ID).to.eql('SGML');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.SortAs', () => {               
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.SortAs).to.eql('SGML');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.GlossTerm', () => {               
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.GlossTerm).to.eql('Standard Generalized Markup Language');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.Acronym', () => {               
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.Acronym).to.eql('SGML');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.Abbrev', () => {               
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.Abbrev).to.eql('ISO 8879:1986');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.GlossDef', () => {                    
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry).to.have.property('GlossDef');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.GlossDef.para', () => {               
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.GlossDef.para).to.eql('A meta-markup language, used to create markup languages such as DocBook.');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.GlossDef.GlossSeeAlso', () => {                    
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.GlossDef).to.have.property('GlossSeeAlso');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.GlossDef.GlossSeeAlso[0]', () => {               
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.GlossDef.GlossSeeAlso[0]).to.eql('GML');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.GlossDef.GlossSeeAlso[1]', () => {               
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.GlossDef.GlossSeeAlso[1]).to.eql('XML');
});
pm.test('glossary.GlossDiv.GlossList.GlossEntry.GlossSee', () => {               
	pm.expect(response.glossary.GlossDiv.GlossList.GlossEntry.GlossSee).to.eql('markup');
});

// negative case
pm.test('token.bunnies', () => {
    pm.expect(response.token).to.not.have.property('bunnies');
});

// Verify that cookies are generated
// we can put these in the cookie jar if we wanted
pm.test('Cookies Generated', () => {
    pm.expect(pm.cookies.has('ARRAffinity')).to.eql(true);
    pm.expect(pm.cookies.has('ARRAffinitySameSite')).to.eql(true);

    // negative case
    pm.expect(pm.cookies.has('bunnies')).to.eql(false);
});
