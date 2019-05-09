const crypto = require('crypto');
const fs = require('fs');
const AWS = require('aws-sdk');
const validUrl = require('valid-url');
const webshot = require('webshot');
const exec = require('child_process').exec;

// overall constants
const screenWidth = 1600;
const screenHeight = 900;

// screenshot the given url
module.exports.take_screenshot = (event, context, cb) => {
  // Get url from queryparamenters and log event
  console.log(event)
  const targetUrl = event.queryStringParameters.url;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  };

  // check if the given url is valid
  if (!validUrl.isUri(targetUrl)) {
    const response = {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({message: `Please provide a valid url, not: ${targetUrl}`})
    }
    cb(null, response);
    return;
  }
  const timeout = 3000; 
  const targetBucket = process.env.bucketName;
  const targetHash = crypto.createHash('md5').update(targetUrl).digest('hex');
  const targetFilename = `${targetHash}.png`;
 
  console.log(`Snapshotting ${targetUrl} to s3://${targetBucket}/${targetFilename}`);
  //take snapshot
    const cmd = `./phantomjs/phantomjs_linux-x86_64 --debug=yes --ignore-ssl-errors=true ./phantomjs/test.js ${targetUrl}`; // eslint-disable-line max-len
    //const cmd =`./phantomjs/phantomjs_osx --debug=no --ignore-ssl-errors=true ./phantomjs/test.js ${targetUrl}`;
    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
  //webshot(targetUrl, `/tmp/${targetHash}.png`, function(err) {
  // screenshot now saved to google.png
    if (error) {
      console.log(error)
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({status: false})
      }
      cb(null, response);
      return
    }else { 
      // snapshotting succeeded, let's upload to S3
        // read the file into buffer
        const fileBuffer = fs.readFileSync(`/tmp/targetFilename.png`);

        // upload the file
        const s3 = new AWS.S3();
        s3.putObject({
          ACL: 'public-read',
          Key: targetFilename,
          Body: fileBuffer,
          Bucket: targetBucket,
          ContentType: 'image/png',
        }, (err) => {
          if (err) {
            console.log(err)
            const response = {
              statusCode: 500,
              headers: headers,
              body: JSON.stringify({status: false})
            }
            cb(null, response);
            return
          } else {
            item = {
              hash: targetHash,
              key: `${targetFilename}`,
              bucket: targetBucket,
            }
          }
          const response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(item)
          };
          cb(null, response);
        });
      }
    });
};