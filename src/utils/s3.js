/* eslint-disable import/no-extraneous-dependencies */
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { aws } = require('../config/config');

const clientParams = {
  bucketEndpoint: aws.bucket_name,
  region: aws.region,
  credentials: {
    secretAccessKey: aws.secret_key,
    accessKeyId: aws.access_key,
  },
};

const client = new S3Client(clientParams);

const uploadS3Image = async (file) => {
  const putObjectParams = {
    Bucket: aws.bucket_name,
    ACL: 'public-read',
    Key: `product/${file.name}`,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(putObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return url;
};

const getS3Image = async (file) => {
  const getObjectParams = {
    Key: `product/${file.name}`,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return url;
};

module.exports = {
  uploadS3Image,
  getS3Image,
};
