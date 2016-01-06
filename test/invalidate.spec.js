'use strict';

const tap = require('tap');
const proxyquire = require('proxyquire');

var c = null;

const voidStub = function(config) {
  c = config;
  c.onComplete();
};

const invalidate = proxyquire('../lib/invalidate', { 'void': voidStub });

tap.test('should resolve when an email is sent successfully', function(t) {
  invalidate()
    .then(() => {
      t.equal(c.paths.length, 1, 'should just invalidate one path');
      t.equal(c.paths[0], '/photos/data.json', 'should invalidate the /photos/data.json path');
      t.equal(c.maxPaths, 1, 'should configure 1 path at a time');
      t.end();
    });
});
