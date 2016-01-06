'use strict';

const tap = require('tap');
const proxyquire = require('proxyquire');

process.env.MAILGUN_API_KEY = 'foo'

var shouldSucceed = null;
var c = null;

const requestStub = (config, next) => {
  c = config;
  if (shouldSucceed) {
    next();
  } else {
    next(new Error('sending error'));
  }
};

const handleError = proxyquire('../lib/error', { 'request': requestStub });

tap.test('should resolve when an email is sent successfully', function(t) {
  shouldSucceed = true;
  let err = new Error('some error');
  handleError.sendEmail(err)
    .then(() => {
      t.equal(c.url, 'https://api:foo@api.mailgun.net/v2/sandboxa4feab1c79724ae08c512bd144dc9873.mailgun.org/messages', 'should send requets to correct URL');
      t.equal(c.method, 'POST', 'should use the POST method');
      t.equal(Object.keys(c.form).length, 4, 'should send the correct number of properties in the form object');
      t.equal(c.form.from, '500px_failure_reporter@joe8bit.com', 'should send form the correct address');
      t.equal(c.form.to, 'joe8bit+website@gmail.com', 'should send to the correct address');
      t.equal(c.form.subject, 'Error updating /photos/data.json', 'should send with the correct subject');
      t.equal(c.form.html, `<p>The following error occured at ${new Date}:</p> <p><code>${JSON.stringify(err)}</code></p>`, 'should send the correct error with json.stringify');
      t.end();
    });
});

tap.test('should reject when an email is not sent successfully', function(t) {
  shouldSucceed = false;
  handleError.throwError = (err) => {
    t.equal(err instanceof Error, true, 'should return an error instance');
    t.equal(err.toString(), 'Error: Some error', 'should pass through the error');
  };
  handleError.sendEmail();
  t.end();
});
