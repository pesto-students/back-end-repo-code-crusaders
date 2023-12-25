const httpStatus = require('http-status');
const { uploadS3Image } = require('../utils/s3');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');

const createUser = catchAsync(async (req, res) => {
  if (await User.isEmailTaken(req.body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getPresignedURL = catchAsync(async (req, res) => {
  // gen preSigned URL
  console.log(req.body);
  const { file } = req.body;
  console.log(file);
  const signedURL = await uploadS3Image(file);

  res.status(httpStatus.OK).send(signedURL);
});

module.exports = {
  createUser,
  getPresignedURL,
};
