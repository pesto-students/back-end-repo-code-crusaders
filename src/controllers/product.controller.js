const httpStatus = require('http-status');
const { v4: uuid } = require('uuid');
const { uploadS3Image, validateS3Objects } = require('../utils/s3');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');
const { Product } = require('../models');

const bucketPath = 'product/';

const getProducts = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['lab']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const labId = req.query.lab ? req.query.lab : req.user._id;

  const lab = await User.findById(labId);
  if (!lab) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No lab found');
  }
  // console.log('lab', lab);
  const filter = {
    lab: lab._id,
  };
  if (typeof req.query.active === 'boolean') {
    filter.active = req.query.active;
  }
  // options.populate = 'lab.lab';

  // console.log(filter);
  // console.log(options);
  // const params = {
  //   name: 'Dental Fillings',
  //   details: {
  //     metal: 'Composite',
  //     features: 'Tooth-colored and natural-looking',
  //     specifications: 'Various filling sizes',
  //     materialComposition: 'Composite resin',
  //   },
  //   price: 80,
  //   mrp: 100,
  //   expectedDays: 5,
  //   customFields: [
  //     {
  //       name: 'Material Type',
  //     },
  //     {
  //       name: 'Shade',
  //     },
  //   ],
  //   lab: req.query.lab,
  //   rating: 4.3,
  // };
  // const product = await Product.create(params);
  // console.log(product);
  console.log(options);
  const products = await Product.paginate(filter, options);

  console.log(products);
  products.lab = lab;

  res.status(httpStatus.OK).send(products);
});

const getProductCount = catchAsync(async (req, res) => {
  console.log('user,,,', req.user);
  const id = req.user._id;
  console.log('id', id);
  const countPromise = Promise.all([
    Product.countDocuments({ lab: id, active: true }),
    Product.countDocuments({ lab: id, active: false }),
  ]);
  const [active, inactive] = await countPromise;

  const productCount = {
    All: active + inactive,
    Active: active,
    Inactive: inactive,
  };
  return res.status(httpStatus.OK).send(productCount);
});

const createProduct = catchAsync(async (req, res) => {
  const labBody = req.body;
  labBody.lab = req.user._id;
  labBody.active = true;

  // validate Images.
  if (!validateS3Objects(labBody.images)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Image Names incuded');
  }
  const product = await Product.create(labBody);

  res.status(httpStatus.CREATED).send(product);
});

const getProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

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
  // console.log(req.body);
  const { file } = req.body;
  file.name = uuid() + file.name;
  // console.log(file);
  const signedURL = await uploadS3Image(file, bucketPath);

  res.status(httpStatus.OK).send({ signedURL, file });
});

module.exports = {
  getProducts,
  getProductCount,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getPresignedURL,
};
