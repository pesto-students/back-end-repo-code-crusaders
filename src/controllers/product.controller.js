const httpStatus = require('http-status');
const { uploadS3Image } = require('../utils/s3');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { User } = require('../models');

const createUser = catchAsync(async (req, res) => {
  if (await User.isEmailTaken(req.body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(req.body);
  // const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
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
  getUsers,
  getUser,
  getPresignedURL,
};
