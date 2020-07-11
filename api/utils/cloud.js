const AWS = require('aws-sdk');
const crypto = require('crypto');
const sharp = require('sharp');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

exports.uploadImage = async (file, square = 0) => {
  const prepareImage = sharp(file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 });
  if (square) prepareImage.resize(square, square);

  const buffer = await prepareImage.toBuffer();
  const filename = crypto.randomBytes(12).toString('hex');

  const data = await s3
    .upload({
      Bucket: process.env.S3_BUCKET,
      Key: `${filename}.jpeg`,
      Body: buffer,
    })
    .promise();
  return data.Location;
};
