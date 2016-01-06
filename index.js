'use strict';

require('dotenv').load();

const fivehundredpx = require('500px');
const jsonfile = require('jsonfile'); 
const path = require('path');
const s3 = require('s3');

const FIVEHUNDREDPX_CONSUMER_KEY = process.env.FIVEHUNDREDPX_CONSUMER_KEY;
const FIVEHUNDREDPX_USERID = 13697373;
const JSON_LOCATION = path.join(__dirname, '.tmp', 'tmp.json');
const UPLOAD_PARAMS = {
  localFile: JSON_LOCATION,
  s3Params: {
    Bucket: process.env.S3_BUCKET,
    Key: 'photos/data.json'
  }
};

const api500px = new fivehundredpx(FIVEHUNDREDPX_CONSUMER_KEY);
const s3client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.S3_ACCCESS_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: 'us-east-1'
  }
});

api500px.photos.getByUserId(FIVEHUNDREDPX_USERID, null, (error, results) => {
  if (error) {
    throw new Error(error);
  } else {
    jsonfile.writeFile(JSON_LOCATION, results, (error) => {
      if (error) {
        throw new Error(error);
      } else {
        let uploader = s3client.uploadFile(UPLOAD_PARAMS);
        uploader.on('error', (error) => {
          throw new Error(error);
        });
        uploader.on('end', () => {
          console.log('Uploading finished');
        });
      }
    });
  }
});
