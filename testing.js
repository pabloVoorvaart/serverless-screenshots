const exec = require('child_process').exec;
const crypto = require('crypto');
const fs = require('fs');
const AWS = require('aws-sdk');
const validUrl = require('valid-url');
const webshot = require('webshot');


// overall constants
const screenWidth = 1600;
const screenHeight = 900;
const timeout = 30000; 
const targetUrl = "https://www.yelp.com/search?find_desc=burgers+&find_loc=Raleigh%2C+NC&ns=1"
const targetBucket = "screenshots-storage-for-fiverr-pablovoorvaart";
const targetHash = crypto.createHash('md5').update(targetUrl).digest('hex');
const targetFilename = `${targetHash}/original.png`;
console.log(targetFilename)
console.log(`Snapshotting ${targetUrl} to s3://${targetBucket}/${targetFilename}`);

/* webshot('https://www.google.com/search?q=seo&oq=seo', "${targetHash}.png", function(err) {
}); */

  // build the cmd for phantom to render the url
  //const cmd = `./phantomjs/phantomjs_linux-x86_64 --debug=yes --ignore-ssl-errors=true ./phantomjs/test.js ${targetUrl} /tmp/${targetHash}.png ${screenWidth} ${screenHeight} ${timeout}`; // eslint-disable-line max-len
   const cmd =`./phantomjs/phantomjs_osx --debug=yes --ignore-ssl-errors=true ./phantomjs/test.js ${targetUrl}  ${targetFilename}  ${screenWidth} ${screenHeight} ${timeout}`;
  console.log(cmd);

  // run the phantomjs command
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      // the command failed (non-zero), fail the entire call
      console.warn(`exec error: ${error}`, stdout, stderr);
    } else {
      // snapshotting succeeded, let's upload to S3
      // read the file into buffer (perhaps make this async?)
      //const fileBuffer = fs.readFileSync(`/tmp/${targetHash}.png`);
      console.warn(`exec error: ${error}`, stdout, stderr);
    }
});