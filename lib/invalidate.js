'use strict';

const Void = require('void');

function invalidate() {
  return new Promise((resolve) => {
    new Void({
      paths: [
        '/photos/data.json'
      ],
      maxPaths: 1,
      onComplete: resolve
    });
  });
}

module.exports = invalidate;
