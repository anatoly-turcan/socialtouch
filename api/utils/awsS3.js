const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

exports.upload = async (file, filename) => {
  const data = await s3
    .upload({
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      Body: file,
    })
    .promise();

  return data.Location;
};
