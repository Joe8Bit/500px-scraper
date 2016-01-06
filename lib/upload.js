'use strict';

const s3 = require('s3');

const s3client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.S3_ACCCESS_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: 'us-east-1'
  }
});

const JSON_LOCATION = require('./cache').path;
const UPLOAD_PARAMS = {
  localFile: JSON_LOCATION,
  s3Params: {
    Bucket: process.env.S3_BUCKET,
    Key: 'photos/data.json'
  }
};

function upload() {
  return new Promise((resolve, reject) => {
    let uploader = s3client.uploadFile(UPLOAD_PARAMS);
    uploader.on('error', reject);
    uploader.on('end', resolve);
  });
}

module.exports = upload;
