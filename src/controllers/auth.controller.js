const httpStatus = require('http-status');
const { v4: uuid } = require('uuid');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService, emailService } = require('../services');
const { uploadS3Image } = require('../utils/s3');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const bucketPath = 'user/';

const register = catchAsync(async (req, res) => {
  const userBody = req.body;
  if (req.body.doctor) {
    userBody.role = 'doctor';
  } else if (req.body.lab) {
    userBody.role = 'lab';
    userBody.address = [userBody.address];
  }

  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);

  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }

  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.send({ user });
});

const getPresignedURL = catchAsync(async (req, res) => {
  // gen preSigned URL
  console.log(req.body);
  const { file } = req.body;
  file.name = uuid() + file.name;

  console.log(file);
  const signedURL = await uploadS3Image(file, bucketPath);

  res.status(httpStatus.OK).send({ signedURL, file });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  verifyUser,
  getPresignedURL,
};
