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
  // await Product.updateMany(
  //   {},
  //   {
  //     $set: {
  //       images: [
  //         'f236bb6d-d407-4176-a239-6aab84ff4494silver_cover.jpg',
  //         'bfbfa72e-abf3-45dd-af5c-c25367496a55gold_cover.jpg',
  //       ],
  //     },
  //   },
  // );
  const products = await Product.paginate(filter, options);
  // products.results = products.results.toObject();
  console.log('options', products);
  products.results = await Promise.all(
    products.results.map(async (product) => {
      const productObj = product.toObject();
      if (productObj.images && productObj.images.length > 0) {
        // Map over the images of the current product and update them
        const updatedImages = await Promise.all(
          productObj.images.map(async (image) => {
            const signedUrl = await getS3Image(image, bucketPath);
            // Assuming that you want to update the image object with the signed URL
            return signedUrl;
          }),
        );

        // Update the images array of the current product with the updatedImages
        return { ...productObj, images: updatedImages };
      }

      // If the product doesn't have images, return it as is
      return product;
    }),
  );

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
  const productBody = req.body;
  productBody.lab = req.user._id;
  productBody.active = true;

  // validate Images.
  if (!validateS3Objects(productBody.images, bucketPath)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Image Names incuded');
  }
  console.log('product body', productBody);
  const product = await Product.create(productBody);

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
  req.body.expectedDays = '13-17';
  Object.assign(product, req.body);
  console.log(product);
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
