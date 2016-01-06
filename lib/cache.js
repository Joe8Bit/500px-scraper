'use strict';

const jsonfile = require('jsonfile'); 
const path = require('path');

const JSON_LOCATION = path.join(__dirname, '..', '.tmp', 'tmp.json');

function cache (data, next) {
   jsonfile.writeFile(JSON_LOCATION, data, next);
}

module.exports = {
  cache: cache,
  path: JSON_LOCATION
};
