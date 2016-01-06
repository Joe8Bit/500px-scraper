'use strict';

const tap = require('tap');
const proxyquire = require('proxyquire');

var shouldSucceed = null;
var k = null;
process.env.FIVEHUNDREDPX_CONSUMER_KEY = 'foobar';

const pixStub = function(key) {
  k = key;
  return {
    photos: {
      getByUserId: (userID, options, next) => {
        if (shouldSucceed) {
          next(null, {
            foo: 'bar'
          });
        } else {
          next(new Error('Some error'));
        }
      }
    }
  };
};

const fixhundredpix = proxyquire('../lib/500px', { '500px': pixStub });

tap.test('should handle a successful response from 500px', function(t) {
  shouldSucceed = true;
  fixhundredpix()
    .then((data) => {
      t.equal(Object.keys(data).length, 1, 'should have th correct number of properties');
      t.equal(data.foo, 'bar', 'should currectly pass through the properties');
      t.end();
    });
});

tap.test('should handle an unsuccessful response from 500px', function(t) {
  shouldSucceed = false;
  fixhundredpix()
    .catch((err) => {
      t.equal(err instanceof Error, true, 'should return an error instance');
      t.equal(err.toString(), 'Error: Some error', 'should pass through the error');
      t.end();
    });
});

tap.test('should use the process.env.FIVEHUNDREDPX_CONSUMER_KEY key', function(t) {
  shouldSucceed = true;
  fixhundredpix();
  t.equal(k, 'foobar', 'should be the correct key');
  t.end();
});
