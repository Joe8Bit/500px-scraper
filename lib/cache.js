'use strict';

const jsonfile = require('jsonfile'); 
const path = require('path');

const JSON_LOCATION = path.join(__dirname, '..', '.tmp', 'tmp.json');

function cache (data) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(JSON_LOCATION, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  cache: cache,
  path: JSON_LOCATION
};
