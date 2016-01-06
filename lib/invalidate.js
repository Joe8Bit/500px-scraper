'use strict';

const Void = require('void');

function invalidate(next) {
  new Void({
    paths: [
      '/photos/data.json'
    ],
    maxPaths: 1,
    onComplete: next
  });
}

module.exports = invalidate;
