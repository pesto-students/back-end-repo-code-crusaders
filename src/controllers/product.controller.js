/* eslint-disable security/detect-non-literal-regexp */
const httpStatus = require('http-status');
const { v4: uuid } = require('uuid');
const { uploadS3Image, validateS3Objects, getS3Image } = require('../utils/s3');
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
  // lab image populate
  lab.image = await getS3Image(lab.image, 'user/');

  // set filters
  const filter = {
    lab: lab._id,
  };

  // check active query
  if (typeof req.query.active === 'boolean') {
    filter.active = req.query.active;
  }
  // only show active products to doctor
  if (req.user.role === 'doctor') {
    filter.active = true;
  }

  // check for search query
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [{ name: searchRegex }];
  }

  // query products
  const products = await Product.paginate(filter, options);

  // popuate image signer urls
  products.results = await Promise.all(
    products.results.map(async (product) => {
      const productObj = product.toObject();
      if (productObj.images && productObj.images.length > 0) {
        // Map over the images of the current product and update them
        const updatedImages = await Promise.all(
          productObj.images.map(async (image) => {
            const signedUrl = await getS3Image(image, bucketPath);
            return signedUrl;
          }),
        );

        // Update the images array of the current product with the updatedImages
        return { ...productObj, images: updatedImages };
      }

      // If the product doesn't have images, return it as is
      return productObj;
    }),
  );

  products.lab = lab;

  res.status(httpStatus.OK).send(products);
});

const getProductCount = catchAsync(async (req, res) => {
  const id = req.user._id;
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
  const productBody = req.body;
  productBody.lab = req.user._id;
  productBody.active = true;

  // validate Images.
  if (!validateS3Objects(productBody.images, bucketPath)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Image Names incuded');
  }
  const product = await Product.create(productBody);

  res.status(httpStatus.CREATED).send(product);
});

const getProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  let product = await Product.findById(productId).populate('lab');
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found');
  }
  product = product.toObject();

  // get Image signed URL
  const updatedImages = await Promise.all(
    product.images.map(async (image) => {
      const signedUrl = await getS3Image(image, bucketPath);
      return signedUrl;
    }),
  );
  product.images = updatedImages;

  res.status(httpStatus.OK).send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No Product Found');
  }
  req.body.expectedDays = '13-17';
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
  const { file } = req.body;
  file.name = uuid() + file.name;

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
