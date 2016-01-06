'use strict';

const tap = require('tap');
const proxyquire = require('proxyquire');

process.env.S3_ACCCESS_KEY = 'foo';
process.env.S3_SECRET = 'bar';
process.env.S3_BUCKET = 'baz'

var authKeys = null;
var uploadParams = null;
var shouldSuccess = null;

const s3Stub = {
  createClient: (options) => {
    authKeys = options.s3Options;
    return {
      uploadFile: (params) => {
        uploadParams = params;
        return {
          on: (evt, next) => {
            if (shouldSuccess && evt === 'end') {
              next();
            } else if (!shouldSuccess && evt === 'error') {
              next(new Error('some error'));
            }
          }
        }
      }
    };
  }
};

const upload = proxyquire('../lib/upload', { 's3': s3Stub });

tap.test('should resolve when an upload is successful', function(t) {
  shouldSuccess = true;
  upload()
    .then(() => {
      t.equal(authKeys.accessKeyId, 'foo', 'should use process.env.S3_ACCCESS_KEY');
      t.equal(authKeys.secretAccessKey, 'bar', 'should use process.env.S3_SECRET');
      t.equal(authKeys.region, 'us-east-1', 'should use the correct region');

      t.notEqual(uploadParams.localFile.indexOf('/.tmp/tmp.json'), -1, 'should expose the correct cache path');
      t.equal(uploadParams.s3Params.Bucket, 'baz', 'should use the correct bucket');
      t.equal(uploadParams.s3Params.Key, 'photos/data.json', 'should upload to the correct path');

      t.end();
    });
});

tap.test('should reject when the upload fails', function(t) {
  shouldSuccess = false;
  upload()
    .catch((err) => {
      t.equal(err instanceof Error, true, 'should return an error instance');
      t.equal(err.toString(), 'Error: some error', 'should pass through the error');
      t.end();
    });
});
