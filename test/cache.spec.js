'use strict';

const tap = require('tap');
const proxyquire = require('proxyquire');

var shouldSucceed = null;
var d = null;
var p = null;

const jsonfileStub = {
  writeFile: (path, data, next) => {
    d = data;
    p = path
    if (shouldSucceed) {
      next();
    } else {
      next(new Error('something went wrong'));
    }
  }
};

const cache = proxyquire('../lib/cache', { 'jsonfile': jsonfileStub });

tap.test('should return success if the cache is written', function(t) {
  shouldSucceed = true;
  cache.cache({
    foo: 'bar'
  }).then(() => {
    t.equal(d.foo, 'bar', 'should pass the data to write to the cache');
    t.end();
  });
});

tap.test('should return a failire if the cache is not written', function(t) {
  shouldSucceed = false;
  cache.cache({
    foo: 'bar'
  })
    .catch((err) => {
      t.equal(err instanceof Error, true, 'should return an error instance');
      t.equal(err.toString(), 'Error: something went wrong', 'should pass through the error');
      t.end();
    });
});

tap.test('should return the cache path', function(t) {
  t.notEqual(cache.path.indexOf('/.tmp/tmp.json'), -1, 'should expose the correct cache path');
  t.end();
});
