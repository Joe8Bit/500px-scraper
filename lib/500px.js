'use strict';

const fivehundredpx = require('500px');

const FIVEHUNDREDPX_CONSUMER_KEY = process.env.FIVEHUNDREDPX_CONSUMER_KEY;
const FIVEHUNDREDPX_USERID = 13697373;

const api500px = new fivehundredpx(FIVEHUNDREDPX_CONSUMER_KEY);

function getData() {
  return new Promise((resolve, reject) => {
    api500px.photos.getByUserId(FIVEHUNDREDPX_USERID, {image_size: 600}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = getData;
