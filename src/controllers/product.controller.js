const httpStatus = require('http-status');
const { uploadS3Image, validateS3Objects } = require('../utils/s3');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
// const { User } = require('../models');
const { Product } = require('../models');

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['lab']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const products = Product.paginate(filter, options);

  console.log(products);

  res.status(httpStatus.OK).send(products);
});

const createProduct = catchAsync(async (req, res) => {
  const labBody = req.body;
  labBody.lab = req.user._id;

  // validate Images.
  if (!validateS3Objects(labBody.images)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Image Names incuded');
  }
  const product = Product.create(labBody);

  res.status(httpStatus.CREATED).send(product);
});

const getProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = Product.findById(productId);

  res.status(httpStatus.OK).send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No Product Found');
  }
  Object.assign(product, req.body);
  await product.save();

  res.status(httpStatus.OK).send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No Product Found');
  }
  await product.remove();

  res.status(httpStatus.NO_CONTENT).send();
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
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getPresignedURL,
};
