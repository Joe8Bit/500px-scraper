'use strict';

const request = require('request');

function handleError(err) {
  sendEmail(err).then(throwError);
}

function sendEmail(err) {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api:${process.env.MAILGUN_API_KEY}@api.mailgun.net/v2/sandboxa4feab1c79724ae08c512bd144dc9873.mailgun.org/messages`,
      method: 'POST',
      form: {
        from: '500px_failure_reporter@joe8bit.com',
        to: 'joe8bit+website@gmail.com',
        subject: 'Error updating /photos/data.json',
        html: `<p>The following error occured at ${new Date}:</p> <p><code>${JSON.stringify(err)}</code></p>`
      }
    }, (error, response, body) => {
      if (error) {
        handleError(error);
      } else {
        resolve(err);
      }
    });
  });
}

function throwError(err) {
  console.error(err);
  throw new Error(err);
  process.exit();
}

module.exports = handleError;
