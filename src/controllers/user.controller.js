const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { getS3Image } = require('../utils/s3');
const { User } = require('../models');

const bucketPath = 'user/';

const createUser = catchAsync(async (req, res) => {
  if (await User.isEmailTaken(req.body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const users = await User.paginate(filter, options);
  res.send(users);
});

const getUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { email } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (email && (await User.isEmailTaken(email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, req.body);
  await user.save();
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  res.status(httpStatus.NO_CONTENT).send();
});

const getLabs = catchAsync(async (req, res) => {
  console.log('getLabs', req.user);

  const filter = {
    city: {
      // eslint-disable-next-line security/detect-non-literal-regexp
      $regex: new RegExp(req.user.city, 'i'),
    },
    role: 'lab',
  };

  const options = {
    populate: 'lab',
  };

  const labs = await User.paginate(filter, options);
  labs.results = await Promise.all(
    labs.results.map(async (lab) => {
      const labObj = lab.toObject();
      if (lab.image) {
        const signedUrl = await getS3Image(lab.image, bucketPath);
        // Update the image of the current lab with the signedURL
        return { ...labObj, image: signedUrl };
      }
      return labObj;
    }),
  );
  console.log(labs);

  res.status(httpStatus.OK).send(labs);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,

  getLabs,
};
