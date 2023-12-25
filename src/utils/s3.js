/* eslint-disable import/no-extraneous-dependencies */
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { aws } = require('../config/config');

const productBucketPrefix = 'product/';

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
    Key: `${productBucketPrefix}${file.name}`,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(putObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return url;
};

const getS3Image = async (file) => {
  const getObjectParams = {
    Key: `${productBucketPrefix}${file.name}`,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return url;
};

const validateS3Objects = async (list) => {
  async function validateObject(file) {
    const headObjectParams = {
      Bucket: aws.bucket_name,
      Key: `${productBucketPrefix}${file.name}`,
    };
    const command = new HeadObjectCommand(headObjectParams);
    try {
      await client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  const responses = await Promise.all(list.map((file) => validateObject(file)));
  return responses.every((isTrue) => isTrue);
};

module.exports = {
  uploadS3Image,
  getS3Image,
  validateS3Objects,
};
